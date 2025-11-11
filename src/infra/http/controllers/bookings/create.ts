import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MaxBookingsPerDayError } from "root/src/use-cases/errors/max-bookings-per-day-error.ts";
import { makeCreateBookingUseCase } from "root/src/use-cases/factories/make-create-booking-use-case.ts";
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts";
import { InvalidTimestampBookingInterval } from "root/src/use-cases/errors/invalid-timestamp-booking-interval.ts";
import { SportCourtDateUnavaliable } from "root/src/use-cases/errors/sport-courts-date-unavaliable.ts";
import { makeCreatePaymentUseCase } from "root/src/use-cases/factories/make-create-payment-use-case.ts";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        startTime: z.date(),
        endTime: z.date()
    })

    const paramsSchema = z.object({
        sportCourtId: z.string().uuid()
    })

    const { startTime, endTime } = bodySchema.parse(request.body)
    const { sportCourtId } = paramsSchema.parse(request.params)
    
    try {
        const createBookingUseCase = makeCreateBookingUseCase()
        const createPaymentUseCase = makeCreatePaymentUseCase()

        const { booking } = await createBookingUseCase.execute({
            userId: request.user.sub,
            sportCourtId,
            startTime,
            endTime
        })

        const { sessionUrl } = await createPaymentUseCase.execute({
            booking
        })

        return reply.status(201).send({ sessionUrl })
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })    
        }

        if (err instanceof InvalidTimestampBookingInterval) {
            return reply.status(400).send({ error: err.message })    
        }


        if (err instanceof MaxBookingsPerDayError) {
            return reply.status(409).send({ error: err.message })    
        }

        if (err instanceof SportCourtDateUnavaliable) {
            return reply.status(409).send({ error: err.message })    
        }

        throw err
    }
}