import type { Booking } from "@prisma/client"
import type { BookingsRepository } from "../repositories/bookings-repository.ts"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { BookingOnSameDate } from "./errors/booking-on-same-date.ts"
import { SportCourtDateUnavaliable } from "./errors/sport-courts-date-unavaliable.ts"

interface CreateBookingUseCaseRequest {
    user_id: string,
    sportCourt_id: string,
    start_time: Date,
    end_time: Date
}

interface CreateBookingUseCaseResponse {
    booking: Booking
}

export class CreateBookingUseCase {
    constructor(
        private bookingRepository: BookingsRepository,
        private sportCourtRepository: SportCourtsRepository
    ) {}

    async execute({ user_id, sportCourt_id, start_time, end_time }: CreateBookingUseCaseRequest): Promise<CreateBookingUseCaseResponse> 
    {
        const sportCourt = await this.sportCourtRepository.findById(sportCourt_id)

        if (!sportCourt) {
            throw new ResourceNotFound()
        }

        const userBookingOnSameDay = await this.bookingRepository.findByUserIdOnDate(
            user_id,
            new Date()
        )

        if (userBookingOnSameDay) {
            throw new BookingOnSameDate()
        }

        const courtBookingTimeConflicts = await this.bookingRepository.findBySportCourtIdOnDates(
            sportCourt_id,
            start_time,
            end_time
        )

        if (courtBookingTimeConflicts) {
            throw new SportCourtDateUnavaliable()
        }

        const booking = await this.bookingRepository.create({
            user_id,
            sportCourt_id,
            start_time,
            end_time
        })

        return {
            booking,
        }
    }
}