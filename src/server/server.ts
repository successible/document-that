import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import proxy from '@fastify/http-proxy'
import next from '@fastify/nextjs'
import Fastify, { FastifyRequest } from 'fastify'

const isProduction = process.env.NODE_ENV
const domain = process.env.CLIENT_DOMAIN

const fastify = Fastify({
  logger: !isProduction,
})

fastify.register(helmet, { contentSecurityPolicy: true })

fastify.register(cors, () => {
  return (request: FastifyRequest, callback: any) => {
    callback(null, {
      origin: isProduction || domain ? domain : 'http://localhost:3050',
    })
  }
})

fastify.register(proxy, {
  http2: false,
  prefix: '/github',
  upstream: 'https://github.com',
})

fastify.get('/healthz', async () => {
  return 200
})

fastify.register(next).after(() => {
  fastify.next('/*')
})

const start = async () => {
  try {
    await fastify.listen({
      host: isProduction ? '0.0.0.0' : '127.0.0.1',
      port: Number(process.env.PORT) || 3001,
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
