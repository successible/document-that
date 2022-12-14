import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import proxy from '@fastify/http-proxy'
import next from '@fastify/nextjs'
import Fastify, { FastifyRequest } from 'fastify'

const isProduction = process.env.NODE_ENV

const fastify = Fastify({
  logger: false,
})

// Security headers for HTTP

fastify.register(helmet, {
  contentSecurityPolicy: {
    // Matches the _headers file in src/public
    directives: {
      connectSrc: ["'self'", 'https://api.github.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  },
})

fastify.register(cors, () => {
  return (request: FastifyRequest, callback: any) => {
    callback(null, {
      // We do not want to enable CORS on production
      // In development, the server and client are on different domains, so it is required.
      origin: isProduction ? false : 'http://localhost:3000',
    })
  }
})

// Required to proxy requests from the browser to GitHub.com to bypass CORS

fastify.register(proxy, {
  http2: false,
  prefix: '/github',
  upstream: 'https://github.com',
})

// Healthcheck route for Docker

fastify.get('/healthz', async () => {
  return 200
})

// On development, Next.js is served via the webpack HMR server on localhost:3000
// On production, Next.js is either a static site or a server
// When it is a server, this register function ensures Next.js is served by the server

if (isProduction) {
  fastify.register(next).after(() => {
    fastify.next('/*')
  })
}

// Boilerplate code to start the Fastify server

const start = async () => {
  const port = Number(process.env.PORT) || 3001
  try {
    await fastify.listen(
      {
        host: isProduction ? '0.0.0.0' : '127.0.0.1',
        port: Number(process.env.PORT) || 3001,
      },
      () => {
        console.log(`Document That server started on ${port}`)
      }
    )
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
