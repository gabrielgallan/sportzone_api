import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeDisableSportCourtAvailabilityUseCase } from "root/src/use-cases/factories/make-disable-court-availability-use-case.ts";
import { SportCourtAlreadyDisabled } from "root/src/use-cases/errors/sport-court-already-disabled.ts";
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts";

export async function disable(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        sportCourtId: z.string().nonempty()
    })

    const { sportCourtId } = paramsSchema.parse(request.params)

    try {
        const disableSportCourtUseCase = makeDisableSportCourtAvailabilityUseCase()

        await disableSportCourtUseCase.execute({
            sportCourtId
        })

        return reply.status(204).send()
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })
        }

        if (err instanceof SportCourtAlreadyDisabled) {
            return reply.status(409).send({ error: err.message })
        }

        throw err
    }
}