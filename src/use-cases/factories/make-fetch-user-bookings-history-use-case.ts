import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts"
import { FetchUserBookingsHistoryUseCase } from "../fetch-user-bookings-history.ts"
import { PrismaBookingsRepository } from "root/src/repositories/prisma/prisma-booking-repository.ts"

export function makeFetchUserBookingsHistoryUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const bookingsRepository = new PrismaBookingsRepository()
    
    const fetchUserBookingsHistoryUseCase = new FetchUserBookingsHistoryUseCase(
        bookingsRepository,
        usersRepository,
    )

    return fetchUserBookingsHistoryUseCase
}