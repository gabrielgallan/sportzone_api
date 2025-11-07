import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"
import { SearchCourtsByLocationUseCase } from "../search-courts-by-location.ts"
import { LocationIqGeocodingServices } from "root/src/infra/external/locationiq/locationiq-geocoding-services.ts"


export function makeSearchCourtsByLocationUseCase() {
    const sportCourtsRepository = new PrismaSportCourtsRepository()
    const geocodingServices = new LocationIqGeocodingServices()

    const searchCourtsByLocationUseCase = new SearchCourtsByLocationUseCase(
        sportCourtsRepository,
        geocodingServices
    )

    return searchCourtsByLocationUseCase
}