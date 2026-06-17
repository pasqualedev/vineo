import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { createCellarSchema } from '@vineo/shared'
import { formatBottleResponse } from '../lib/format-bottle'

const cellarParamsSchema = z.object({ id: z.string().uuid() })
const listCellarsQuerySchema = z.object({ userId: z.string().uuid().optional() })

const cellarsRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/cellars
  server.post('/api/cellars', async (request, reply) => {
    const body = createCellarSchema.parse(request.body)

    const cellar = await server.prisma.cellar.create({
      data: {
        name: body.name,
        rows: body.rows,
        columns: body.columns,
        userId: body.userId,
      },
    })

    return reply.status(201).send({
      id: cellar.id,
      name: cellar.name,
      rows: cellar.rows,
      columns: cellar.columns,
      createdAt: cellar.createdAt.toISOString(),
    })
  })

  // GET /api/cellars
  server.get('/api/cellars', async (request) => {
    const { userId } = listCellarsQuerySchema.parse(request.query)

    const where = userId ? { userId } : {}

    const cellars = await server.prisma.cellar.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return cellars.map((c) => ({
      id: c.id,
      name: c.name,
      rows: c.rows,
      columns: c.columns,
      createdAt: c.createdAt.toISOString(),
    }))
  })

  // GET /api/cellars/:id
  server.get('/api/cellars/:id', async (request, reply) => {
    const { id } = cellarParamsSchema.parse(request.params)

    const cellar = await server.prisma.cellar.findUnique({
      where: { id },
      include: {
        bottles: {
          include: { wineReference: true },
          orderBy: [{ rowPosition: 'asc' }, { columnPosition: 'asc' }],
        },
      },
    })

    if (!cellar) {
      return reply.status(404).send({ error: 'Cellar not found' })
    }

    return {
      id: cellar.id,
      name: cellar.name,
      rows: cellar.rows,
      columns: cellar.columns,
      createdAt: cellar.createdAt.toISOString(),
      bottles: cellar.bottles.map(formatBottleResponse),
    }
  })
}

export default cellarsRoutes
