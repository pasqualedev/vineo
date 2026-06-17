import type { FastifyPluginAsync } from 'fastify'
import { createCellarSchema } from '@vineo/shared'

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
    const { userId } = request.query as { userId?: string }

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
    const { id } = request.params as { id: string }

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

    return cellar
  })
}

export default cellarsRoutes
