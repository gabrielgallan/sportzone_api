import type { SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"

interface SearchForNearbyCourtsUseCaseRequest {
    userLatitude: number,
    userLongitude: number,
    page: number
}

interface SearchForNearbyCourtsUseCaseResponse {
    sportCourts: SportCourt[]
}

export class SearchForNearbyCourtsUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ userLatitude, userLongitude, page }: SearchForNearbyCourtsUseCaseRequest): Promise<SearchForNearbyCourtsUseCaseResponse> {
        const sportCourts = await this.sportCourtsRepository.searchManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        }, page)

        return {
            sportCourts,
        }
    }
}