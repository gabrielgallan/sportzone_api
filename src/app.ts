import fastify from 'fastify'
import env from './env/config.ts'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { userRoutes } from './infra/http/controllers/users/routes.ts'
import { courtRoutes } from './infra/http/controllers/courts/routes.ts'

const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(courtRoutes)

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


export default app