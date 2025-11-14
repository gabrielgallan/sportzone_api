import { ThrowErrorOnBookingUseCase } from "../throw-error-on-booking.ts"
import { PrismaBookingsRepository } from "root/src/repositories/prisma/prisma-booking-repository.ts"

export function makeThrowErrorOnBookingUseCase() {
    const bookingsRepository = new PrismaBookingsRepository()

    const throwErrorOnBookingUseCase = new ThrowErrorOnBookingUseCase(
        bookingsRepository,
    )

    return throwErrorOnBookingUseCase
}