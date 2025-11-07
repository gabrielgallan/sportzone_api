import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchForNearbyCourtsUseCase } from "root/src/use-cases/factories/make-search-for-nearby-courts-use-case.ts";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        userLatitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        userLongitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
        page: z.coerce.number().min(1).default(1)
    })

    const { userLatitude, userLongitude, page } = bodySchema.parse(request.body)

    const searchForNearbyCourtsUseCase = makeSearchForNearbyCourtsUseCase()

    const { sportCourts } = await searchForNearbyCourtsUseCase.execute({
        userLatitude,
        userLongitude,
        page
    })

    return reply.status(200).send({ sportCourts })
}