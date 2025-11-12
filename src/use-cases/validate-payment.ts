import { type Payment } from "@prisma/client"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import { PaymentAlreadyPaid } from "./errors/payment-already-paid.ts"

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
            throw new ResourceNotFound()
        }
        
        if (paymentExists.validated_at) {
            throw new PaymentAlreadyPaid()
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