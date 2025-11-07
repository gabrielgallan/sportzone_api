import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { RestrictCourtDateUseCase } from './restrict-court-dates.ts'
import { InMemoryCourtBlockedDatesRepository } from '../repositories/in-memory/in-memory-court-blocked-dates-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import type { CourtBlockedDatesRepository } from '../repositories/court-blocked-dates-repository.ts'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { IncorrectTimestampInterval } from './errors/incorrect-timestamp-interval.ts'

let courtBlockedDatesRepository: CourtBlockedDatesRepository
let sportCourtsRepository: SportCourtsRepository
let sut: RestrictCourtDateUseCase

describe('Restrict Court Dates Use Case', () => {
    beforeEach(() => {
        courtBlockedDatesRepository = new InMemoryCourtBlockedDatesRepository()
        sportCourtsRepository = new InMemorySportCourtsRepository()

        sut = new RestrictCourtDateUseCase(
            sportCourtsRepository,
            courtBlockedDatesRepository
        )

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able restrict court date', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 10, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'SportCourt 1',
            type: 'none',
            location: 'Shopping Jardim Sul',
            latitude: -23.6305222,
            longitude: -46.7361007,
            price_per_hour: 20
        })

        const { courtBlockedDate } = await sut.execute({
            sportCourtId: sportCourt.id,
            startDate: new Date(2025, 0, 15, 8, 0),
            endDate: new Date(2025, 0, 15, 15, 0),
            reason: null
        })

        expect(courtBlockedDate).toEqual(expect.objectContaining({
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 15, 8, 0),
            end_time: new Date(2025, 0, 15, 15, 0)
        }))
    })

    it('should not be able restrict court date with incorrect timestamp', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 10, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'SportCourt 1',
            type: 'none',
            location: 'Shopping Jardim Sul',
            latitude: -23.6305222,
            longitude: -46.7361007,
            price_per_hour: 20
        })

        await expect(() =>
            sut.execute({
                sportCourtId: sportCourt.id,
                startDate: new Date(2025, 0, 15, 18, 0),
                endDate: new Date(2025, 0, 15, 9, 0),
                reason: null
            })
        ).rejects.toBeInstanceOf(IncorrectTimestampInterval)
    })
})