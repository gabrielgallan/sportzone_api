import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchCourtsBySportTypeUseCase } from "root/src/use-cases/factories/make-search-courts-by-sport-type-use-case.ts";

export async function findType(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        type: z.string().nonempty(),
        page: z.coerce.number().min(1).default(1)
    })

    const { type, page } = bodySchema.parse(request.body)

    const searchCourtsBySportTypeUseCase = makeSearchCourtsBySportTypeUseCase()

    const { sportCourts } = await searchCourtsBySportTypeUseCase.execute({
        type,
        page
    })

    return reply.status(200).send({ sportCourts })
}