import type { FastifyReply, FastifyRequest } from "fastify"
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts"
import { makeGetProfileUseCase } from "root/src/use-cases/factories/make-get-profile-use-case.ts"


export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub
    
    try {
        const getUserProfile = makeGetProfileUseCase()

        const { user } = await getUserProfile.execute({ userId })

        return reply.status(200).send({ 
            ...user,
            password_hash: undefined,
         })
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })    
        }

        throw err
    }
}