import type { SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import type { GeocodingServices } from "../infra/external/geocoding-services.ts"

interface SearchCourtsByLocationUseCaseRequest {
    routeName: string,
    number: string | number
    page: number
}

interface SearchCourtsByLocationUseCaseResponse {
    sportCourts: SportCourt[]
}

export class SearchCourtsByLocationUseCase {
    constructor(
        private sportCourtsRepository: SportCourtsRepository,
        private geocodingServices: GeocodingServices
    ) {}

    async execute({ routeName, number, page }: SearchCourtsByLocationUseCaseRequest): Promise<SearchCourtsByLocationUseCaseResponse> {
        const address = `${routeName} ${number}`
        
        const { latitude, longitude } = await this.geocodingServices.getCordinatesFromAddress({ address })
        
        const sportCourts = await this.sportCourtsRepository.searchManyNearby({
            latitude,
            longitude
        }, page)

        return {
            sportCourts,
        }
    }
}