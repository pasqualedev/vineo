import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { createUserSchema } from '@vineo/shared'

const userParamsSchema = z.object({ id: z.string().uuid() })

const usersRoutes: FastifyPluginAsync = async (server) => {
  // POST /api/users/init — creates a new user (no auth for MVP)
  server.post('/api/users/init', async (request, reply) => {
    // Body is optional; `name` defaults to 'Enófilo' via the schema.
    const { name } = createUserSchema.parse(request.body ?? {})

    const user = await server.prisma.user.create({
      data: {
        email: `user-${Date.now()}@vineo.app`,
        name,
      },
    })

    return reply.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    })
  })

  // GET /api/users/:id
  server.get('/api/users/:id', async (request, reply) => {
    const { id } = userParamsSchema.parse(request.params)

    const user = await server.prisma.user.findUnique({ where: { id } })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
  })
}

export default usersRoutes
