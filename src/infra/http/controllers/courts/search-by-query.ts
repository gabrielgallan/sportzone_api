import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchCourtsByQueryUseCase } from "root/src/use-cases/factories/make-search-courts-by-query-use-case.ts";
import { AddressNotFound } from "root/src/infra/external/locationiq/errors/address-not-found.ts";
import { LocationIqServerError } from "root/src/infra/external/locationiq/errors/locationiq-server-error.ts";

export async function query(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        routeName: z.string().nonempty(),
        number: z.coerce.number(),
        sportType: z.string().nullable(),
        page: z.coerce.number().min(1).default(1)
    })

    const { routeName, number, sportType, page } = bodySchema.parse(request.body)

    try {
        const searchCourtsByQueryUseCase = makeSearchCourtsByQueryUseCase()

        const { sportCourts } = await searchCourtsByQueryUseCase.execute({
            routeName,
            number,
            sportType,
            page
        })

        return reply.status(200).send({ sportCourts })
    } catch (err) {
        if (err instanceof AddressNotFound) {
            return reply.status(404).send({ error: err.message })
        }

        if (err instanceof LocationIqServerError) {
            return reply.status(502).send({ error: err.message })
        }

        throw err
    }
}