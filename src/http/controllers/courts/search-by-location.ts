import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchCourtsByLocationUseCase } from "root/src/use-cases/factories/make-search-courts-by-location-use-case.ts";
import { ResponseRateLimitError } from "root/src/integrations/geocoding/errors/response-rate-limit-error.ts";
import { AddressNotFound } from "root/src/integrations/geocoding/errors/address-not-found.ts";
import { GeocodingHttpRequestError } from "root/src/integrations/geocoding/errors/geocoding-http-request-error.ts";

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
        if (err instanceof ResponseRateLimitError) {
            return reply.status(429).send({ error: err.message })
        }

        if (err instanceof AddressNotFound) {
            return reply.status(404).send({ error: err.message })
        }

        if (err instanceof GeocodingHttpRequestError) {
            return reply.status(500).send({ error: err.message })
        }

        throw err
    }
}