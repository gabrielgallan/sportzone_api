import type { Prisma, SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import { getDistanceBetweenCordinates } from "../utils/get-distance-between-cordinates.ts"

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
        const sportCourts = await this.sportCourtsRepository.searchAll()

        const NEARBY_DISTANCE = 10

        const nearbySportCourts = sportCourts.filter(court => {
            const distance = getDistanceBetweenCordinates(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: court.latitude.toNumber(), longitude: court.longitude.toNumber() }
            )

            return distance < NEARBY_DISTANCE
        }).slice((page - 1) * 20, page * 20)

        return {
            sportCourts: nearbySportCourts,
        }
    }
}