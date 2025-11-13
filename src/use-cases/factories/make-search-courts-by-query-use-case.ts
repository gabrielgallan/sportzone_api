import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { SearchCourtsByQueryUseCase } from "../search-courts-by-query.ts"
import { LocationIqGeocodingServices } from "root/src/infra/geocoding/locationiq/locationiq-geocoding-services.ts"


export function makeSearchCourtsByQueryUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()
    const geocodingServices = new LocationIqGeocodingServices()

    const searchCourtsByQueryUseCase = new SearchCourtsByQueryUseCase(
        sportCourtsRepository,
        geocodingServices
    )

    return searchCourtsByQueryUseCase
}