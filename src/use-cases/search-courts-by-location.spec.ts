import { it, describe, expect, beforeEach } from 'vitest'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { SearchCourtsByLocationUseCase } from './search-courts-by-location.ts'
import type { GeocodingServices } from '../infra/external/geocoding-services.ts'
import { LocationIqGeocodingServices } from '../infra/external/locationiq/locationiq-geocoding-services.ts'
import { AddressNotFound } from '../infra/external/locationiq/errors/address-not-found.ts'

let sportCourtsRepository: SportCourtsRepository
let geocodingServices: GeocodingServices
let sut: SearchCourtsByLocationUseCase

describe('Search courts by location address use case', () => {
    beforeEach(() => {
        sportCourtsRepository = new InMemorySportCourtsRepository()
        geocodingServices = new LocationIqGeocodingServices()
        
        sut = new SearchCourtsByLocationUseCase(
            sportCourtsRepository,
            geocodingServices
        )
    })

    it('should be able to search courts by location address', async () => {
        // => Creating an example court far away of the address searched
        await sportCourtsRepository.create({
            title: 'SportCourt 1',
            type: 'none',
            location: 'Shopping Jardim Sul',
            latitude: -23.6305222,
            longitude: -46.7361007,
            price_per_hour: 20
        })

        // => Creating two example courts near of the address searched
        await sportCourtsRepository.create({
            title: 'SportCourt 2',
            type: 'none',
            location: 'Shopping Center Norte',
            latitude: -23.5159715,
            longitude: -46.6244467,
            price_per_hour: 20
        })

        await sportCourtsRepository.create({
            title: 'SportCourt 3',
            type: 'none',
            location: 'Ultra Academia - Vila Guilherme',
            latitude: -23.5013606,
            longitude: -46.5980158,
            price_per_hour: 20
        })

        const { sportCourts } = await sut.execute({
            routeName: 'Rua Chico Pontes',
            number: 921,
            page: 1
        })

        expect(sportCourts).toHaveLength(2)
    })

    it('should not be able to search courts by non-existent location address', async () => {
        await expect(() =>
            sut.execute({
                routeName: 'non-existent-street',
                number: 0,
                page: 1
            })
        ).rejects.toBeInstanceOf(AddressNotFound)
    })
})