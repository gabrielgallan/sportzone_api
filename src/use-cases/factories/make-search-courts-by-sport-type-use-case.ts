import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { SearchCourtsBySportTypeUseCase } from "../search-courts-by-sport-type.ts"


export function makeSearchCourtsBySportTypeUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()

    const searchCourtsBySportTypeUseCase = new SearchCourtsBySportTypeUseCase(
        sportCourtsRepository,
    )

    return searchCourtsBySportTypeUseCase
}