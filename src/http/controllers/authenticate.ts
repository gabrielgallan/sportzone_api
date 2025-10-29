import type { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "root/src/use-cases/errors/invalid-credentials-error.ts";
import { makeAuthenticateUseCase } from "root/src/use-cases/factories/make-authenticate-use-case.ts";
import z from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = bodySchema.parse(request.body)
    
    try {
        const authenticateUseCase = makeAuthenticateUseCase()

        const response = await authenticateUseCase.execute({ email, password })

        return reply.status(200).send({ status: 'Authenticate' })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(401).send({ error: err.message })    
        }

        throw err
    }
}