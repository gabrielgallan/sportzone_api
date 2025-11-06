import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { SearchCourtsByLocationUseCase } from "../search-courts-by-location.ts"


export function makeSearchCourtsByLocationUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()

    const searchCourtsByLocationUseCase = new SearchCourtsByLocationUseCase(
        sportCourtsRepository,
    )

    return searchCourtsByLocationUseCase
}