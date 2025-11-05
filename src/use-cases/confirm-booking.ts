import { BookingStatus, type Booking } from "@prisma/client"
import type { BookingsRepository } from "../repositories/bookings-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"

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
        const bookingExists = await this.bookingRepository.findById(bookingId)

        if (!bookingExists) {
            throw new ResourceNotFound()
        }

        if (bookingExists.status !== BookingStatus.PENDING) {
            throw new InvalidBookingStatus()
        }

        bookingExists.status = BookingStatus.CONFIRMED

        const booking = await this.bookingRepository.save(bookingExists) 

        return {
            booking,
        }
    }
}