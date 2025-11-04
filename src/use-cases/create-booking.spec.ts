import { it, describe, expect, beforeEach, afterEach, vi, expectTypeOf } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { BookingsRepository } from 'root/src/repositories/bookings-repository.ts'
import { CreateBookingUseCase } from './create-booking.ts'
import { randomUUID } from 'crypto'
import type { SportCourtsRepository } from 'root/src/repositories/sport-courts-repository.ts'
import { InMemorySportCourtsRepository } from 'root/src/repositories/in-memory/in-memory-sport-courts-repository.ts'
import { SportCourtDateUnavaliable } from './errors/sport-courts-date-unavaliable.ts'
import { BookingOnSameDate } from './errors/booking-on-same-date.ts'

let bookingRepository: BookingsRepository
let sportCourtsRepository: SportCourtsRepository
let sut: CreateBookingUseCase

describe('Create Booking Use Case', () => {
    beforeEach(() => {
        bookingRepository = new InMemoryBookingsRepository()
        sportCourtsRepository = new InMemorySportCourtsRepository()

        sut = new CreateBookingUseCase(bookingRepository, sportCourtsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to create a new booking', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'Volei SportCourt',
            type: 'Volei',
            location: 'Shopping Jardim Sul Quadra',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

        const { booking } = await sut.execute({
            user_id: randomUUID(),
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 13, 10, 0, 0),
            end_time: new Date(2025, 0, 13, 13, 0, 0),
        })

        expect(booking.id).toEqual(expect.any(String))
    })

    it('should not be able to create two booking in the same day', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'Volei SportCourt',
            type: 'Volei',
            location: 'Shopping Jardim Sul Quadra',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

        const { booking } = await sut.execute({
            user_id: randomUUID(),
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 13, 10, 0, 0),
            end_time: new Date(2025, 0, 13, 14, 0, 0),
        })

        await expect(() =>
            sut.execute({
                user_id: booking.user_id,
                sportCourt_id: sportCourt.id,
                start_time: new Date(2025, 0, 13, 14, 0, 0),
                end_time: new Date(2025, 0, 13, 16, 0, 0),
            })
        ).rejects.toBeInstanceOf(BookingOnSameDate)
    })

    it('should be able to create two bookings on different days', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 10, 0, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'Volei SportCourt',
            type: 'Volei',
            location: 'Shopping Jardim Sul Quadra',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

        const firstBooking = await sut.execute({
            user_id: randomUUID(),
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 13, 14, 0, 0),
            end_time: new Date(2025, 0, 13, 16, 0, 0),
        })

        const { user_id } = firstBooking.booking

        vi.setSystemTime(new Date(2025, 0, 14, 10, 0, 0))

        const secondBooking = await sut.execute({
            user_id,
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 16, 14, 0, 0),
            end_time: new Date(2025, 0, 16, 16, 0, 0),
        })

        const { id } = secondBooking.booking

        expect(id).toEqual(expect.any(String))
    })

    it('should not be able to create a booking on data its already reserved.', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const sportCourt = await sportCourtsRepository.create({
            title: 'Volei SportCourt',
            type: 'Volei',
            location: 'Shopping Jardim Sul Quadra',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

        const booking1 = await sut.execute({
            user_id: randomUUID(),
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 16, 10, 0, 0),
            end_time: new Date(2025, 0, 16, 14, 0, 0),
        })

        await expect(() =>
            sut.execute({
                user_id: randomUUID(),
                sportCourt_id: sportCourt.id,
                start_time: new Date(2025, 0, 16, 13, 0, 0),
                end_time: new Date(2025, 0, 16, 16, 0, 0),
            })
        ).rejects.toBeInstanceOf(SportCourtDateUnavaliable)
    })
})