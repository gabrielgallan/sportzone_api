import type { SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"
import { GetGeocodingByAddress } from "../integrations/geocoding/get-cordinate-from-address.ts"

interface SearchCourtsByLocationUseCaseRequest {
    routeName: string,
    number: string | number
    page: number
}

interface SearchCourtsByLocationUseCaseResponse {
    sportCourts: SportCourt[]
}

export class SearchCourtsByLocationUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ routeName, number, page }: SearchCourtsByLocationUseCaseRequest): Promise<SearchCourtsByLocationUseCaseResponse> {
        const location = `${routeName} ${number}`
        
        const { latitude, longitude } = await GetGeocodingByAddress(location)
        
        const sportCourts = await this.sportCourtsRepository.searchManyNearby({
            latitude,
            longitude
        }, page)

        return {
            sportCourts,
        }
    }
}