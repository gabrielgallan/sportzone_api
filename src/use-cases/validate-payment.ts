import { type Payment } from "@prisma/client"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"

interface ValidatePaymentUseCaseRequest {
    paymentExternalId: string,
}

interface ValidatePaymentUseCaseResponse {
    payment: Payment,
}

export class ValidatePaymentUseCase {
    constructor(
        private paymentsRepository: PaymentsRepository,
    ) {}

    async execute({
        paymentExternalId
    }: ValidatePaymentUseCaseRequest): Promise<ValidatePaymentUseCaseResponse>
    {
        const paymentExists = await this.paymentsRepository.findByExternalId(paymentExternalId)

        if (!paymentExists) {
            throw new Error()
        }
        
        if (paymentExists.validated_at) {
            throw new Error()
        }

        const payment = await this.paymentsRepository.save({
            ...paymentExists,
            validated_at: new Date()
        })

        return {
            payment,
        }
    }
}