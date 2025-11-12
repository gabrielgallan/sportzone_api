import type { Payment } from "@prisma/client"
import type { PaymentServices } from "./externals/payments-services/payments-services.ts"
import env from "../env/config.ts"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"

interface CreateCheckoutSessionUseCaseRequest {
    payment: Payment,
}

interface CreateCheckoutSessionUseCaseResponse {
    sessionId: string
    sessionUrl: string
}

export class CreateCheckoutSessionUseCase {
    constructor(
        private paymentServices: PaymentServices,
        private paymentsRepository: PaymentsRepository
    ) { }

    async execute({
        payment
    }: CreateCheckoutSessionUseCaseRequest): Promise<CreateCheckoutSessionUseCaseResponse> 
    {
        if (payment.external_id) {
            throw new Error('Session already exists!')
        }

        const { sessionId, sessionUrl } = await this.paymentServices.createCheckoutSession({
            paymentId: payment.id,
            bookingId: payment.booking_id,
            amount: Number(payment.amount),
            currency: payment.currency,
            userEmail: payment.user_email,
            successUrl: env.FRONT_END_URL + '/checkout/success',
            cancelUrl: env.FRONT_END_URL + '/checkout/cancel',
            description: payment.description
        })

        await this.paymentsRepository.save({
            ...payment,
            external_id: sessionId
        })

        return {
            sessionId,
            sessionUrl,
        }
    }
}