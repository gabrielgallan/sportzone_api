import type { SportCourt } from "@prisma/client";
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts";
import { ResourceNotFound } from "./errors/resource-not-found.ts";

interface ActivateSportCourtAvailabilityUseCaseRequest {
    sportCourtId: string
}

interface ActivateSportCourtAvailabilityUseCaseResponse {
    sportCourt: SportCourt
}

export class ActivateSportCourtAvailabilityUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ sportCourtId }: ActivateSportCourtAvailabilityUseCaseRequest): Promise<ActivateSportCourtAvailabilityUseCaseResponse> {
        const sportCourt = await this.sportCourtsRepository.findById(sportCourtId)

        if (!sportCourt) {
            throw new ResourceNotFound()
        }

        sportCourt.is_active = true

        await this.sportCourtsRepository.save(sportCourt)

        return { 
            sportCourt,
        }
    }
}