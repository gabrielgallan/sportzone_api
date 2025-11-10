import { it, describe, expect, beforeEach } from 'vitest'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { ActivateSportCourtAvailabilityUseCase } from './active-court-availability.ts'

let sportCourtsRepository: SportCourtsRepository
let sut: ActivateSportCourtAvailabilityUseCase

describe('Activate sport court availability Use Case', () => {
    beforeEach(() => {
        sportCourtsRepository = new InMemorySportCourtsRepository()
        sut = new ActivateSportCourtAvailabilityUseCase(sportCourtsRepository)
    })

    it('should be able to activate sport court availability', async () => {
        const sportCourt = await sportCourtsRepository.create({
            title: 'Volei SportCourt',
            type: 'Volei',
            location: 'Shopping Jardim Sul Quadra',
            phone: '1234-5678',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

        await sut.execute({
            sportCourtId: sportCourt.id
        })

        expect(sportCourt.is_active).toBe(true)
    })
})