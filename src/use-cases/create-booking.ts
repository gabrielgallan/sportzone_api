import type { Booking } from "@prisma/client"
import type { BookingsRepository } from "../repositories/bookings-repository.ts"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { BookingOnSameDate } from "./errors/booking-on-same-date.ts"
import { SportCourtDateUnavaliable } from "./errors/sport-courts-date-unavaliable.ts"
import dayjs from "dayjs"

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
        const startDate = dayjs(start_time)
        const endDate = dayjs(end_time)


        // Checking if SportCourt exists
        const sportCourt = await this.sportCourtRepository.findById(sportCourt_id)

        if (!sportCourt) {
            throw new ResourceNotFound()
        }

        //Checking if is a 2 hours difference
        const isATwoHoursDifference = startDate.isAfter(dayjs().add(2, 'hour'))

        if (!isATwoHoursDifference) {
            throw new Error()
        }

        //Checking if ...
        const dateIsChronologicallyCorrect = startDate.isBefore(endDate)

        if (!dateIsChronologicallyCorrect) {
            throw new Error()
        }

        const differenceBetweenDates = endDate.diff(startDate, 'hour', true)

        if (!(differenceBetweenDates <= 6)) {
            throw new Error()
        }

        // Checking if user has already create a booking today
        const userHasAlreadyBookingToday = await this.bookingRepository.findByUserIdOnDate(
            user_id,
            new Date()
        )

        if (userHasAlreadyBookingToday) {
            throw new BookingOnSameDate()
        }

        // Checking if court it's already occupied
        const courtItsAlreadyOccupied = await this.bookingRepository.findBySportCourtIdOnDates(
            sportCourt_id,
            start_time,
            end_time
        )

        if (courtItsAlreadyOccupied) {
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