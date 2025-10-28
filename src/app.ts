import fastify from 'fastify'
import prisma from './lib/prisma.ts'

const app = fastify()

app.get('/', async (request, reply) => {
    const users = await prisma.user.findMany()

    return reply.status(200).send({ users })
})

export default app