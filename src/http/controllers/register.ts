import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts";
import { UserWithSameEmailError } from "root/src/use-cases/errors/user-with-same-email.ts";
import { RegisterUseCase } from "root/src/use-cases/register.ts";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string()
    })

    const { name, email, password } = bodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const user = registerUseCase.execute({ name, email, password })

        return reply.status(201).send()
    } catch (err) {
        if (err instanceof UserWithSameEmailError) {
            return reply.status(409).send({ error: err.message })    
        }

        return reply.status(500).send({ error: 'Internal Server Error!' })
    }
}