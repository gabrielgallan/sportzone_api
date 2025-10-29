import fastify from 'fastify'
import { appRoutes } from './http/routes.ts'
import { ZodError } from 'zod'
import env from './env/config.ts'

const app = fastify()

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400)
        .send({ message: 'Data validation error!', issues: error.format() })
    }
    
    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // Here i should send log to an external toll like DataDog/Sentry
    }
    
    return reply.status(500).send({ message: 'Internal Server Error' })
})

await app.register(appRoutes)

export default app