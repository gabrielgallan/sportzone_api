import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { BookingsRepository } from 'root/src/repositories/bookings-repository.ts'
import { BookingStatus } from '@prisma/client'
import { ThrowErrorOnBookingUseCase } from './throw-error-on-booking.ts'
import { makeBooking } from '../utils/test/unit/factories/make-booking.ts'

let bookingRepository: BookingsRepository
let sut: ThrowErrorOnBookingUseCase

describe('Throw error on a booking register Use Case', () => {
    beforeEach(() => {
        bookingRepository = new InMemoryBookingsRepository()
        sut = new ThrowErrorOnBookingUseCase(bookingRepository)
    })

    it('should be able to update booking status to ERROR', async () => {
        const createdBooking = await makeBooking(bookingRepository)

        const { booking } = await sut.execute({
            bookingId: createdBooking.id
        })

        expect(booking.status).toBe(BookingStatus.ERROR)
    })
})