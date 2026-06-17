import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import {
  matchOrCreateSchema,
  moveBottleSchema,
  updateBottleStatusSchema,
  getGuardRule,
} from '@vineo/shared'
import { formatBottleResponse } from '../lib/format-bottle'

const cellarParamsSchema = z.object({ cellarId: z.string().uuid() })
const bottleParamsSchema = z.object({ id: z.string().uuid() })

/** Postgres unique-constraint violation raised by Prisma. */
function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
  )
}

const bottlesRoutes: FastifyPluginAsync = async (server) => {
  // GET /api/cellars/:cellarId/bottles
  server.get('/api/cellars/:cellarId/bottles', async (request, reply) => {
    const { cellarId } = cellarParamsSchema.parse(request.params)

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

    let wineReference = await resolveWineReference(server, body)

    if (!wineReference) {
      const grape = body.grape ?? 'Unknown'
      const guard = getGuardRule(grape)

      wineReference = await server.prisma.wineReference.create({
        data: {
          name: body.name ?? body.rawOcrText ?? 'Custom Wine',
          winery: body.winery ?? 'Unknown',
          grape,
          region: body.region ?? 'Unknown',
          country: body.country ?? 'Unknown',
          barcode: body.barcode || null,
          guardMin: guard.min,
          guardMax: guard.max,
        },
      })
    }

    try {
      const bottle = await server.prisma.bottle.create({
        data: {
          vintage: body.vintage,
          price: body.price ?? null,
          rowPosition: body.rowPosition,
          columnPosition: body.columnPosition,
          cellarId: body.cellarId,
          wineReferenceId: wineReference.id,
        },
        include: { wineReference: true },
      })

      return reply.status(201).send(formatBottleResponse(bottle))
    } catch (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: 'Position already occupied' })
      }
      throw error
    }
  })

  // PATCH /api/bottles/:id/move
  server.patch('/api/bottles/:id/move', async (request, reply) => {
    const { id } = bottleParamsSchema.parse(request.params)
    const body = moveBottleSchema.parse(request.body)

    const bottle = await server.prisma.bottle.findUnique({ where: { id } })

    if (!bottle) {
      return reply.status(404).send({ error: 'Bottle not found' })
    }

    try {
      const updated = await server.prisma.bottle.update({
        where: { id },
        data: {
          rowPosition: body.rowPosition,
          columnPosition: body.columnPosition,
        },
        include: { wineReference: true },
      })

      return formatBottleResponse(updated)
    } catch (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: 'Target position already occupied' })
      }
      throw error
    }
  })

  // PATCH /api/bottles/:id/status
  server.patch('/api/bottles/:id/status', async (request, reply) => {
    const { id } = bottleParamsSchema.parse(request.params)
    const { status } = updateBottleStatusSchema.parse(request.body)

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

type WineReferenceRow = Prisma.WineReferenceGetPayload<object>

/**
 * Resolves an existing WineReference by barcode first, then by fuzzy trigram
 * match against the OCR text. Returns null when nothing confident is found.
 */
async function resolveWineReference(
  server: FastifyInstance,
  body: { barcode: string | null; rawOcrText: string | null },
): Promise<WineReferenceRow | null> {
  if (body.barcode) {
    const byBarcode = await server.prisma.wineReference.findUnique({
      where: { barcode: body.barcode },
    })
    if (byBarcode) return byBarcode
  }

  if (body.rawOcrText) {
    const matches = await server.prisma.$queryRaw<
      Array<{ id: string; similarity: number }>
    >`
      SELECT id, similarity(name, ${body.rawOcrText}) AS similarity
      FROM "WineReference"
      WHERE name % ${body.rawOcrText}
      ORDER BY similarity DESC
      LIMIT 1
    `

    if (matches.length > 0 && matches[0].similarity > 0.3) {
      return server.prisma.wineReference.findUnique({
        where: { id: matches[0].id },
      })
    }
  }

  return null
}

export default bottlesRoutes
