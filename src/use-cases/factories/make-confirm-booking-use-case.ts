import { ConfirmBookingUseCase } from "../confirm-booking.ts"
import { PrismaBookingsRepository } from "root/src/repositories/prisma/prisma-booking-repository.ts"

export function makeConfirmBookingUseCase() {
    const bookingsRepository = new PrismaBookingsRepository()
    const confirmBookingUseCase = new ConfirmBookingUseCase(bookingsRepository)

    return confirmBookingUseCase
}