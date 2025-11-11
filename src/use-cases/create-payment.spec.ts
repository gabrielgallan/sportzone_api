import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryBookingsRepository } from 'root/src/repositories/in-memory/in-memory-bookings-repository.ts'
import type { BookingsRepository } from 'root/src/repositories/bookings-repository.ts'
import type { PaymentsRepository } from '../repositories/payments-repository.ts'
import { InMemoryPaymentsRepository } from '../repositories/in-memory/in-memory-payments-repository.ts'
import { CreatePaymentUseCase } from './create-payment.ts'

let paymentsRepository: PaymentsRepository
let sut: CreatePaymentUseCase

describe('Create payment register to booking Use Case', () => {
    beforeEach(() => {
        paymentsRepository = new InMemoryPaymentsRepository()

        sut = new CreatePaymentUseCase(
            paymentsRepository,
        )

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to create payment register to booking', async () => {
        vi.setSystemTime(new Date(2025, 0, 13, 10, 0))
    })
})