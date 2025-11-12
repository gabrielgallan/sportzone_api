import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { BookingsRepository } from 'root/src/repositories/bookings-repository.ts'
import type { PaymentsRepository } from '../repositories/payments-repository.ts'
import { InMemoryPaymentsRepository } from '../repositories/in-memory/in-memory-payments-repository.ts'
import { RegisterPaymentUseCase } from './register-payment.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import type { SportCourtsRepository } from '../repositories/sport-courts-repository.ts'
import type { IPaymentServices } from '../payments/payments-services.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts'
import { InMemorySportCourtsRepository } from '../repositories/in-memory/in-memory-sport-courts-repository.ts'
import { StripePaymentServices } from '../payments/stripe/stripe-payment-services.ts'
import { ValidatePaymentUseCase } from './validate-payment.ts'
import { PaymentAlreadyPaid } from './errors/payment-already-paid.ts'


let paymentsRepository: PaymentsRepository
let sut: ValidatePaymentUseCase

describe('Validate payment register Use Case', () => {
    beforeEach(() => {
        paymentsRepository = new InMemoryPaymentsRepository()

        sut = new ValidatePaymentUseCase(
            paymentsRepository,
        )

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate payment register', async () => {
        await paymentsRepository.create({
            external_id: 'payment-01',
            amount: 50,
            booking_id: 'booking-01'
        })

        const { payment } = await sut.execute({
            paymentExternalId: 'payment-01'
        })

        expect(payment.validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate payment already paid', async () => {
        await paymentsRepository.create({
            external_id: 'payment-01',
            amount: 50,
            booking_id: 'booking-01'
        })

        await sut.execute({
            paymentExternalId: 'payment-01'
        })

        await expect(() =>
            sut.execute({
                paymentExternalId: 'payment-01'
            })
        ).rejects.toBeInstanceOf(PaymentAlreadyPaid)
    })
})