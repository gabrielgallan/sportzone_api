import { it, describe, expect, beforeEach } from 'vitest'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { SearchCourtsBySportTypeUseCase } from './search-courts-by-sport-type.ts'

let sportCourtsRepository: SportCourtsRepository
let sut: SearchCourtsBySportTypeUseCase

describe('Search many courts by sport type use case', () => {
    beforeEach(() => {
        sportCourtsRepository = new InMemorySportCourtsRepository()
        sut = new SearchCourtsBySportTypeUseCase(sportCourtsRepository)
    })

    it('should be able to search courts by sport type', async () => {
        for (let c = 0; c < 21; c++) {
            await sportCourtsRepository.create({
                title: 'Volei SportCourt',
                type: 'Volei',
                location: 'Shopping Jardim Sul Quadra',
                phone: '1234-5678',
                latitude: -23.630180,
                longitude: -46.735809,
                price_per_hour: 20
            })
        }

        for (let c = 0; c < 5; c++) {
            await sportCourtsRepository.create({
                title: 'BasketBall SportCourt',
                type: 'BasketBall',
                location: 'Shopping Morumbi Quadra',
                phone: '1234-5678',
                latitude: -23.630180,
                longitude: -46.735809,
                price_per_hour: 20
            })
        }

        const voleiTypesPage01 = await sut.execute({
            type: 'volei',
            page: 1
        })

        const voleiTypesPage02 = await sut.execute({
            type: 'volei',
            page: 2
        })

        const basketTypesPage01 = await sut.execute({
            type: 'basketball',
            page: 1
        })

        expect(voleiTypesPage01.sportCourts).toHaveLength(20)
        expect(voleiTypesPage02.sportCourts).toHaveLength(1)
        expect(basketTypesPage01.sportCourts).toHaveLength(5)
    })
})