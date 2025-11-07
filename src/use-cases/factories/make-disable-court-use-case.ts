import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { DisableSportCourtUseCase } from "../disable-court.ts" 

export function makeDisableSportCourtUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()
    const disableSportCourtUseCase = new DisableSportCourtUseCase(sportCourtsRepository)

    return disableSportCourtUseCase
}