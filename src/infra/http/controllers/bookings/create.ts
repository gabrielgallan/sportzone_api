import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MaxBookingsPerDayError } from "root/src/use-cases/errors/max-bookings-per-day-error.ts";
import { makeCreateBookingUseCase } from "root/src/use-cases/factories/make-create-booking-use-case.ts";
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts";
import { InvalidTimestampBookingInterval } from "root/src/use-cases/errors/invalid-timestamp-booking-interval.ts";
import { SportCourtDateAlreadyOccupied } from "root/src/use-cases/errors/sport-courts-date-already-occupied.ts";
import { makeRegisterPaymentUseCase } from "root/src/use-cases/factories/make-register-payment-use-case.ts";
import { SportCourtUnavailable } from "root/src/use-cases/errors/sport-court-unavailable.ts";
import { SportCourtDateBlocked } from "root/src/use-cases/errors/sport-court-date-blocked.ts";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        startTime: z.coerce.date(),
        endTime: z.coerce.date()
    })

    const paramsSchema = z.object({
        sportCourtId: z.string().uuid()
    })

    const { startTime, endTime } = bodySchema.parse(request.body)
    const { sportCourtId } = paramsSchema.parse(request.params)
    
    try {
        const createBookingUseCase = makeCreateBookingUseCase()
        const registerPaymentUseCase = makeRegisterPaymentUseCase()

        const { booking } = await createBookingUseCase.execute({
            userId: request.user.sub,
            sportCourtId,
            startTime,
            endTime
        })

        const { sessionUrl } = await registerPaymentUseCase.execute({
            booking
        })

        return reply.status(201).send({ sessionUrl })
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })    
        }

        if (err instanceof SportCourtUnavailable) {
            return reply.status(503).send({ error: err.message })    
        }

        if (err instanceof InvalidTimestampBookingInterval) {
            return reply.status(400).send({ error: err.message })    
        }

        if (err instanceof MaxBookingsPerDayError) {
            return reply.status(409).send({ error: err.message })    
        }

        if (err instanceof SportCourtDateAlreadyOccupied) {
            return reply.status(409).send({ error: err.message })    
        }

        if (err instanceof SportCourtDateBlocked) {
            return reply.status(503).send({ error: err.message })    
        }

        throw err
    }
}