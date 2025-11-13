import { BookingStatus, type Booking } from "@prisma/client"
import type { BookingsRepository } from "../repositories/bookings-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"
import dayjs from "dayjs"
import { LateBookingConfirmation } from "./errors/late-booking-validation.ts"

interface ConfirmBookingUseCaseRequest {
    bookingId: string
}

interface ConfirmBookingUseCaseResponse {
    booking: Booking
}

export class ConfirmBookingUseCase {
    constructor(private bookingRepository: BookingsRepository) {}

    async execute({ 
        bookingId 
    }: ConfirmBookingUseCaseRequest): Promise<ConfirmBookingUseCaseResponse> {
        const booking = await this.bookingRepository.findById(bookingId)

        if (!booking) {
            throw new ResourceNotFound()
        }

        const distanceInMinutesFromBookingCreation = dayjs(new Date()).diff(
            booking.created_at,
            'minutes'
        )

        if (distanceInMinutesFromBookingCreation > 35) {
            booking.status = BookingStatus.ERROR

            await this.bookingRepository.save(booking)

            throw new LateBookingConfirmation()
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new InvalidBookingStatus()
        }

        booking.status = BookingStatus.CONFIRMED

        await this.bookingRepository.save(booking) 

        return {
            booking,
        }
    }
}