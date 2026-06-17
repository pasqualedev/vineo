import type { FastifyPluginAsync } from 'fastify'
import { matchOrCreateSchema, moveBottleSchema } from '@vineo/shared'
import { calculateEvolution } from '../lib/evolution'

const bottlesRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/cellars/:id/bottles
  server.get('/api/cellars/:cellarId/bottles', async (request, reply) => {
    const { cellarId } = request.params as { cellarId: string }

    const cellar = await server.prisma.cellar.findUnique({
      where: { id: cellarId },
    })

    if (!cellar) {
      return reply.status(404).send({ error: 'Cellar not found' })
    }

    const bottles = await server.prisma.bottle.findMany({
      where: { cellarId },
      include: { wineReference: true },
    })

    return bottles.map((b) => formatBottleResponse(b))
  })

  // POST /api/bottles/match-or-create
  server.post('/api/bottles/match-or-create', async (request, reply) => {
    const body = matchOrCreateSchema.parse(request.body)

    const cellar = await server.prisma.cellar.findUnique({
      where: { id: body.cellarId },
    })

    if (!cellar) {
      return reply.status(404).send({ error: 'Cellar not found' })
    }

    const existing = await server.prisma.bottle.findUnique({
      where: {
        cellarId_rowPosition_columnPosition: {
          cellarId: body.cellarId,
          rowPosition: body.rowPosition,
          columnPosition: body.columnPosition,
        },
      },
    })

    if (existing) {
      return reply.status(409).send({ error: 'Position already occupied' })
    }

    let wineReference = null

    if (body.barcode) {
      wineReference = await server.prisma.wineReference.findUnique({
        where: { barcode: body.barcode },
      })
    }

    if (!wineReference && body.rawOcrText) {
      const words = body.rawOcrText.split(' ').filter(Boolean).join(' & ')
      const matches = await server.prisma.$queryRawUnsafe<Array<{ id: string; similarity: number }>>(
        `SELECT id, similarity(name, $1) as sim
         FROM "WineReference"
         WHERE name % $1
         ORDER BY sim DESC
         LIMIT 1`,
        body.rawOcrText,
      )

      if (matches.length > 0 && matches[0].similarity > 0.3) {
        wineReference = await server.prisma.wineReference.findUnique({
          where: { id: matches[0].id },
        })
      }
    }

    if (!wineReference) {
      wineReference = await server.prisma.wineReference.create({
        data: {
          name: body.rawOcrText || 'Custom Wine',
          winery: 'Unknown',
          grape: 'Unknown',
          region: 'Unknown',
          country: 'Unknown',
          barcode: body.barcode || null,
          guardMin: 2,
          guardMax: 8,
        },
      })
    }

    const bottle = await server.prisma.bottle.create({
      data: {
        vintage: body.vintage,
        rowPosition: body.rowPosition,
        columnPosition: body.columnPosition,
        cellarId: body.cellarId,
        wineReferenceId: wineReference.id,
      },
      include: { wineReference: true },
    })

    return reply.status(201).send(formatBottleResponse(bottle))
  })

  // PATCH /api/bottles/:id/move
  server.patch('/api/bottles/:id/move', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = moveBottleSchema.parse(request.body)

    const bottle = await server.prisma.bottle.findUnique({ where: { id } })

    if (!bottle) {
      return reply.status(404).send({ error: 'Bottle not found' })
    }

    const conflict = await server.prisma.bottle.findUnique({
      where: {
        cellarId_rowPosition_columnPosition: {
          cellarId: bottle.cellarId,
          rowPosition: body.rowPosition,
          columnPosition: body.columnPosition,
        },
      },
    })

    if (conflict && conflict.id !== id) {
      return reply.status(409).send({ error: 'Target position already occupied' })
    }

    const updated = await server.prisma.bottle.update({
      where: { id },
      data: {
        rowPosition: body.rowPosition,
        columnPosition: body.columnPosition,
      },
      include: { wineReference: true },
    })

    return formatBottleResponse(updated)
  })

  // PATCH /api/bottles/:id/status
  server.patch('/api/bottles/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: 'STORED' | 'CONSUMED' | 'GIFTED' }

    const bottle = await server.prisma.bottle.findUnique({ where: { id } })

    if (!bottle) {
      return reply.status(404).send({ error: 'Bottle not found' })
    }

    const updated = await server.prisma.bottle.update({
      where: { id },
      data: {
        status,
        consumedAt: status === 'CONSUMED' ? new Date() : null,
      },
      include: { wineReference: true },
    })

    return formatBottleResponse(updated)
  })
}

function formatBottleResponse(bottle: {
  id: string
  vintage: number
  purchaseDate: Date | null
  price: { toNumber: () => number } | null
  rowPosition: number
  columnPosition: number
  status: string
  notes: string | null
  wineReference: {
    name: string
    winery: string
    grape: string
    region: string
    country: string
  }
}) {
  const evolution = calculateEvolution(bottle.vintage, bottle.wineReference.grape)

  return {
    id: bottle.id,
    vintage: bottle.vintage,
    purchaseDate: bottle.purchaseDate?.toISOString() ?? null,
    price: bottle.price ? Number(bottle.price) : null,
    rowPosition: bottle.rowPosition,
    columnPosition: bottle.columnPosition,
    status: bottle.status,
    notes: bottle.notes,
    wine: {
      name: bottle.wineReference.name,
      winery: bottle.wineReference.winery,
      grape: bottle.wineReference.grape,
      region: bottle.wineReference.region,
      country: bottle.wineReference.country,
    },
    evolution,
  }
}

export default bottlesRoutes
