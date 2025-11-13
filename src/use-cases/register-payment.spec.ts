import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { PaymentsRepository } from '../repositories/payments-repository.ts'
import { InMemoryPaymentsRepository } from '../repositories/in-memory/in-memory-payments-repository.ts'
import { RegisterPaymentUseCase } from './register-payment.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { InvalidBookingStatus } from './errors/invalid-booking-status-error.ts'
import { makeUser } from '../utils/test/unit/factories/make-user.ts'
import { makeSportCourt } from '../utils/test/unit/factories/make-sport-court.ts'
import { makeBooking } from '../utils/test/unit/factories/make-booking.ts'


let paymentsRepository: PaymentsRepository
let usersRepository: UsersRepository
let sportCourtRepository: SportCourtsRepository

let sut: RegisterPaymentUseCase

describe('Create payment register to booking Use Case', () => {
    beforeEach(() => {
        paymentsRepository = new InMemoryPaymentsRepository()
        usersRepository = new InMemoryUsersRepository()
        sportCourtRepository = new InMemorySportCourtsRepository()

        sut = new RegisterPaymentUseCase(
            paymentsRepository,
            usersRepository,
            sportCourtRepository
        )

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to create payment register to booking', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const bookingsRepository = new InMemoryBookingsRepository()

        const user = await makeUser(usersRepository)
        const sportCourt = await makeSportCourt(sportCourtRepository, user)
        const booking = await makeBooking(bookingsRepository, user, sportCourt)

        const { payment } = await sut.execute({
            booking
        })

        expect(payment.id).toEqual(expect.any(String))
        expect(payment.external_id).toEqual(null)
    })

    it('should not be able to create payment register to a booking already confirmed', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const user = await makeUser(usersRepository)
        const sportCourt = await makeSportCourt(sportCourtRepository, user)

        const booking = await new InMemoryBookingsRepository().create({
            status: 'CONFIRMED',
            user_id: user.id,
            sportCourt_id: sportCourt.id,
            start_time: new Date(2025, 0, 13, 12, 0, 0),
            end_time: new Date(2025, 0, 13, 16, 0, 0),
            price: 80
        })

        await expect(() => 
            sut.execute({
                booking
            })
        ).rejects.toBeInstanceOf(InvalidBookingStatus)
    })
})