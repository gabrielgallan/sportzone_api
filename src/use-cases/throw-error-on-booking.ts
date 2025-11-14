import { BookingStatus, type Booking } from "@prisma/client"
import type { BookingsRepository } from "../repositories/bookings-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"
import dayjs from "dayjs"
import { LateBookingConfirmation } from "./errors/late-booking-validation.ts"

interface ThrowErrorOnBookingUseCaseRequest {
    bookingId: string
}

interface ThrowErrorOnBookingUseCaseResponse {
    booking: Booking
}

export class ThrowErrorOnBookingUseCase {
    constructor(private bookingRepository: BookingsRepository) {}

    async execute({ 
        bookingId 
    }: ThrowErrorOnBookingUseCaseRequest): Promise<ThrowErrorOnBookingUseCaseResponse> {
        const booking = await this.bookingRepository.findById(bookingId)

        if (!booking) {
            throw new ResourceNotFound()
        }

        booking.status = BookingStatus.ERROR

        await this.bookingRepository.save(booking) 

        return {
            booking,
        }
    }
}