import { CreateBookingUseCase } from "../create-booking.ts"
import { PrismaBookingsRepository } from "root/src/repositories/prisma/prisma-booking-repository.ts"
import { PrismaCourtBlockedDatesRepository } from "root/src/repositories/prisma/prisma-court-blocked-dates-repository.ts"
import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"

export function makeCreateBookingUseCase() {
    const bookingsRepository = new PrismaBookingsRepository()
    const sportCourtRepository = new PrismaSportCourtsRepository()
    const courtBlockedDatesRepository = new PrismaCourtBlockedDatesRepository()

    const createBookingUseCase = new CreateBookingUseCase(
        bookingsRepository,
        sportCourtRepository,
        courtBlockedDatesRepository
    )

    return createBookingUseCase
}