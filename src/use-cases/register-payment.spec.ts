import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { PaymentsRepository } from '../repositories/payments-repository.ts'
import { InMemoryPaymentsRepository } from '../repositories/in-memory/in-memory-payments-repository.ts'
import { RegisterPaymentUseCase } from './register-payment.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import type { CreateChekoutSessionRequest, IPaymentServices } from '../payments/payments-services.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { StripePaymentServices } from '../payments/stripe/stripe-payment-services.ts'
import { InvalidBookingStatus } from './errors/invalid-booking-status-error.ts'
import { randomUUID } from 'crypto'


let paymentsRepository: PaymentsRepository
let usersRepository: UsersRepository
let sportCourtRepository: SportCourtsRepository

let paymentServices: IPaymentServices

let sut: RegisterPaymentUseCase

class FakePaymentServices implements IPaymentServices {
    async createCheckoutSession(params: CreateChekoutSessionRequest) {
        return {
            sessionId: randomUUID(),
            sessionUrl: randomUUID(),
        }
    }
    
}

describe('Create payment register to booking Use Case', () => {
    beforeEach(() => {
        paymentsRepository = new InMemoryPaymentsRepository()
        usersRepository = new InMemoryUsersRepository()
        sportCourtRepository = new InMemorySportCourtsRepository()
        paymentServices = new FakePaymentServices()

        sut = new RegisterPaymentUseCase(
            paymentsRepository,
            paymentServices,
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

        const user = await usersRepository.create({
            name: 'Gabriel',
            email: 'gabriel@example.com',
            password_hash: 'passwordHashed'
        })

        const booking = await new InMemoryBookingsRepository().create({
            user_id: user.id,
            sportCourt_id: 'sp-01',
            start_time: new Date(2025, 0, 13, 12, 0, 0),
            end_time: new Date(2025, 0, 13, 16, 0, 0),
            price: 80
        })

        const { payment, sessionUrl } = await sut.execute({
            booking
        })

        expect(payment).toEqual(expect.objectContaining({
            external_id: expect.any(String)
        }))
    })

    it('should not be able to create payment register to a booking already confirmed', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 7, 0, 0))

        const user = await usersRepository.create({
            name: 'Gabriel',
            email: 'gabriel@example.com',
            password_hash: 'passwordHashed'
        })

        const booking = await new InMemoryBookingsRepository().create({
            status: 'CONFIRMED',
            user_id: user.id,
            sportCourt_id: 'sp-01',
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