import type { Prisma, SportCourt } from "@prisma/client";
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts";
import { ResourceNotFound } from "./errors/resource-not-found.ts";
import { SportCourtAlreadyDisabled } from "./errors/sport-court-already-disabled.ts";

interface DisableSportCourtUseCaseRequest {
    sportCourtId: string
}

interface DisableSportCourtUseCaseResponse {
    sportCourt: SportCourt
}

export class DisableSportCourtUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ sportCourtId }: DisableSportCourtUseCaseRequest): Promise<DisableSportCourtUseCaseResponse> {
        const sportCourt = await this.sportCourtsRepository.findById(sportCourtId)

        if (!sportCourt) {
            throw new ResourceNotFound()
        }

        if (!sportCourt.is_active) {
            throw new SportCourtAlreadyDisabled()
        }

        sportCourt.is_active = false

        await this.sportCourtsRepository.save(sportCourt)

        return { 
            sportCourt,
        }
    }
}