import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts"
import { CancelBookingUseCase } from "../cancel-booking.ts"
import { PrismaBookingsRepository } from "root/src/repositories/prisma/prisma-booking-repository.ts"

export function makeCancelBookingUseCase() {
    const bookingsRepository = new PrismaBookingsRepository()
    const cancelBookingUseCase = new CancelBookingUseCase(bookingsRepository)

    return cancelBookingUseCase
}