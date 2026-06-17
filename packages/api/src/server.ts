import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import prismaPlugin from './plugins/prisma'
import cellarsRoutes from './routes/cellars'
import bottlesRoutes from './routes/bottles'
import usersRoutes from './routes/users'
import { registerLogger, logReady } from './lib/logger'

const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = process.env.HOST || '0.0.0.0'

async function main() {
  const app = Fastify({ logger: false })

  registerLogger(app)

  await app.register(cors, { origin: true })
  await app.register(prismaPlugin)
  await app.register(cellarsRoutes)
  await app.register(bottlesRoutes)
  await app.register(usersRoutes)

  app.get('/api/health', async () => ({ status: 'ok' }))

  try {
    await app.listen({ port: PORT, host: HOST })
    logReady(HOST, PORT)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
