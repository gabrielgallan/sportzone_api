import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { BookingOnSameDate } from "root/src/use-cases/errors/max-bookings-per-day-error.ts";
import { makeCreateBookingUseCase } from "root/src/use-cases/factories/make-create-booking-use-case.ts";
import { ResourceNotFound } from "root/src/use-cases/errors/resource-not-found.ts";
import { InvalidTimestampBookingInterval } from "root/src/use-cases/errors/invalid-timestamp-booking-interval.ts";
import { SportCourtDateUnavaliable } from "root/src/use-cases/errors/sport-courts-date-unavaliable.ts";

export async function createBooking(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        userId: z.string(),
        sportCourtId: z.string(),
        startTime: z.date(),
        endTime: z.date()
    })

    const body = bodySchema.parse(request.body)
    
    try {
        const createBookingUseCase = makeCreateBookingUseCase()

        const { booking } = await createBookingUseCase.execute(body)

        return reply.status(201).send({ status: 'Booking created!' })
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return reply.status(404).send({ error: err.message })    
        }

        if (err instanceof InvalidTimestampBookingInterval) {
            return reply.status(400).send({ error: err.message })    
        }


        if (err instanceof BookingOnSameDate) {
            return reply.status(409).send({ error: err.message })    
        }

        if (err instanceof SportCourtDateUnavaliable) {
            return reply.status(409).send({ error: err.message })    
        }

        throw err
    }
}