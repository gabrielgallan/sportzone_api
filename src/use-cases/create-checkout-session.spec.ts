import { it, describe, expect, beforeEach, vi } from 'vitest'
import { CreateCheckoutSessionUseCase } from './create-checkout-session.ts'
import { InMemoryPaymentsRepository } from '../repositories/in-memory/in-memory-payments-repository.ts'
import type { PaymentsRepository } from '../repositories/payments-repository.ts'
import type { PaymentServices } from './externals/payments-services/payments-services.ts'
import { makePayment } from '../utils/test/unit/factories/make-payment.ts'

let paymentsRepository: PaymentsRepository
let paymentServices: PaymentServices
let sut: CreateCheckoutSessionUseCase

describe('Create a checkout session Use Case', () => {
    beforeEach(() => {
        paymentsRepository = new InMemoryPaymentsRepository()
        paymentServices = {
            createCheckoutSession: vi.fn().mockResolvedValue({
                sessionId: 'mock-session-id',
                sessionUrl: 'https://mock-session-url',
            }),
        }

        sut = new CreateCheckoutSessionUseCase(
            paymentServices,
            paymentsRepository,
        )
    })

    it('should be able to create a checkout session', async () => {
        const payment = await makePayment(paymentsRepository, false)

        const { sessionId, sessionUrl } = await sut.execute({
            payment
        })

        expect(sessionId).toEqual(expect.any(String))
        expect(sessionUrl).toEqual(expect.any(String))
    })

    it('should not be able to create a checkout session if already exists', async () => {
        const payment = await makePayment(paymentsRepository, true)

        await expect(() =>
            sut.execute({
                payment
            })
        ).rejects.toBeInstanceOf(Error)
    })
})