import type { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts"
import { makeGetProfileUseCase } from "root/src/use-cases/factories/make-get-profile-use-case.ts"
import z from "zod"


export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        userId: z.string().uuid()
    })

    const { userId } = bodySchema.parse(request.body)
    
    try {
        const getUserProfile = makeGetProfileUseCase()

        const response = await getUserProfile.execute({ userId })

        return reply.status(200).send({ user: response.user })
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })    
        }

        throw err
    }
}