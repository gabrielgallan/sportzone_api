import { it, describe, expect, beforeEach } from 'vitest'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { DisableSportCourtAvailabilityUseCase } from './disable-court-availability.ts'
import { SportCourtAlreadyDisabled } from './errors/sport-court-already-disabled.ts'

let sportCourtsRepository: SportCourtsRepository
let sut: DisableSportCourtAvailabilityUseCase

describe('Disable sport court availability Use Case', () => {
    beforeEach(() => {
        sportCourtsRepository = new InMemorySportCourtsRepository()
        sut = new DisableSportCourtAvailabilityUseCase(sportCourtsRepository)
    })

    it('should be able to disable sport court availability', async () => {
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

        expect(sportCourt.is_active).toBe(false)
    })

    it('should not be able to disable a sport court already unavailable', async () => {
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

        await expect(() =>
            sut.execute({
                sportCourtId: sportCourt.id
            })
        ).rejects.toBeInstanceOf(SportCourtAlreadyDisabled)
    })
})