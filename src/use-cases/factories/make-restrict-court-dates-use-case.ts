import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts"
import { RestrictCourtDateUseCase } from "../restrict-court-dates.ts"
import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { PrismaCourtBlockedDatesRepository } from "root/src/repositories/prisma/prisma-court-blocked-dates-repository.ts"

export function makeRestrictCourtDateUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()
    const courtBlockedDatesRepository = new PrismaCourtBlockedDatesRepository()

    const restrictCourtDateUseCase = new RestrictCourtDateUseCase(
        sportCourtsRepository,
        courtBlockedDatesRepository
    )

    return restrictCourtDateUseCase
}