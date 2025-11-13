import { it, describe, expect, beforeEach } from 'vitest'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { SearchCourtsByQueryUseCase } from './search-courts-by-query.ts'
import type { GeocodingServices } from '../infra/geocoding/geocoding-services.ts'
import { LocationIqGeocodingServices } from '../infra/geocoding/locationiq/locationiq-geocoding-services.ts'
import { AddressNotFound } from '../infra/geocoding/locationiq/errors/address-not-found.ts'

let sportCourtsRepository: SportCourtsRepository
let geocodingServices: GeocodingServices
let sut: SearchCourtsByQueryUseCase

describe('Search courts by query (address, sport type) use case', () => {
    beforeEach(() => {
        sportCourtsRepository = new InMemorySportCourtsRepository()
        geocodingServices = new LocationIqGeocodingServices()
        
        sut = new SearchCourtsByQueryUseCase(
            sportCourtsRepository,
            geocodingServices
        )
    })

    it('should be able to search courts by location address', async () => {
        // => Creating an example court far away of the address searched
        await sportCourtsRepository.create({
            owner_id: 'owner-01',
            title: 'SportCourt 1',
            type: 'Soccer',
            location: 'Shopping Jardim Sul',
            latitude: -23.6305222,
            longitude: -46.7361007,
            price_per_hour: 20
        })

        // => Creating two example courts near of the address searched
        await sportCourtsRepository.create({
            owner_id: 'owner-01',
            title: 'SportCourt 2',
            type: 'Soccer',
            location: 'Shopping Center Norte',
            latitude: -23.5159715,
            longitude: -46.6244467,
            price_per_hour: 20
        })

        // => Creating an example of volei sport court
        await sportCourtsRepository.create({
            owner_id: 'owner-02',
            title: 'SportCourt 3',
            type: 'Volei',
            location: 'Ultra Academia - Vila Guilherme',
            latitude: -23.5013606,
            longitude: -46.5980158,
            price_per_hour: 20
        })

        const { sportCourts } = await sut.execute({
            routeName: 'Rua Chico Pontes',
            number: 921,
            sportType: 'Volei',
            page: 1
        })

        expect(sportCourts).toHaveLength(1)
    })

    it('should not be able to search courts by non-existent location address', async () => {
        await expect(() =>
            sut.execute({
                routeName: 'non-existent-street',
                number: 0,
                sportType: null,
                page: 1
            })
        ).rejects.toBeInstanceOf(AddressNotFound)
    })
})