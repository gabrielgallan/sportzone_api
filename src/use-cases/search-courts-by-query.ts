import type { SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import type { GeocodingServices } from "../infra/external/geocoding-services.ts"

interface SearchCourtsByQueryUseCaseRequest {
    routeName: string,
    number: number | null,
    sportType: string | null
    page: number
}

interface SearchCourtsByQueryUseCaseResponse {
    sportCourts: SportCourt[]
}

export class SearchCourtsByQueryUseCase {
    constructor(
        private sportCourtsRepository: SportCourtsRepository,
        private geocodingServices: GeocodingServices
    ) {}

    async execute({ 
        routeName, 
        number, 
        sportType, 
        page }: SearchCourtsByQueryUseCaseRequest): Promise<SearchCourtsByQueryUseCaseResponse> 
    {
        const address = `${routeName} ${number}`
        
        const { latitude, longitude } = await this.geocodingServices.getCordinatesFromAddress({ address })
        
        const sportCourts = await this.sportCourtsRepository.searchManyByCordinates({
            latitude,
            longitude
        },
            sportType,
            page
        )

        return {
            sportCourts,
        }
    }
}