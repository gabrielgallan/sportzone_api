import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchCourtsByLocationUseCase } from "@/use-cases/factories/make-search-courts-by-location-use-case.ts";
import { AddressNotFound } from "root/src/infra/external/locationiq/errors/address-not-found.ts";
import { LocationIqServerError } from "root/src/infra/external/locationiq/errors/locationiq-server-error.ts";
import { InternalServerError } from "root/src/infra/external/locationiq/errors/internal-server-error.ts";

export async function findLocation(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        routeName: z.string().nonempty(),
        number: z.coerce.number(),
        page: z.coerce.number().min(1).default(1)
    })

    const { routeName, number, page } = bodySchema.parse(request.body)

    try {
        const searchCourtsByLocationUseCase = makeSearchCourtsByLocationUseCase()

        const { sportCourts } = await searchCourtsByLocationUseCase.execute({
            routeName,
            number,
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