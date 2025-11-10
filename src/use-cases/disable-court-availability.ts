import type { SportCourt } from "@prisma/client";
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts";
import { ResourceNotFound } from "./errors/resource-not-found.ts";
import { SportCourtAlreadyDisabled } from "./errors/sport-court-already-disabled.ts";

interface DisableSportCourtAvailabilityUseCaseRequest {
    sportCourtId: string
}

interface DisableSportCourtAvailabilityUseCaseResponse {
    sportCourt: SportCourt
}

export class DisableSportCourtAvailabilityUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ sportCourtId }: DisableSportCourtAvailabilityUseCaseRequest): Promise<DisableSportCourtAvailabilityUseCaseResponse> {
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