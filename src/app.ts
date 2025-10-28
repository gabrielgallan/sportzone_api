import fastify from 'fastify'
import { appRoutes } from './http/routes.ts'

const app = fastify()

await app.register(appRoutes)

export default app