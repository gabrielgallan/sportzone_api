import type { Payment } from "@prisma/client"
import type { PaymentGateway } from "@/infra/payments-gateway/payments-gateway.ts"
import env from "../env/config.ts"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"

interface CreateOrderSessionUseCaseRequest {
    payment: Payment,
}

interface CreateOrderSessionUseCaseResponse {
    redirectUrl: string
}

export class CreateOrderSessionUseCase {
    constructor(
        private paymentsGateway: PaymentGateway,
        private paymentsRepository: PaymentsRepository
    ) { }

    async execute({
        payment
    }: CreateOrderSessionUseCaseRequest): Promise<CreateOrderSessionUseCaseResponse> 
    {
        if (payment.order_id) {
            throw new Error('Session already exists!')
        }

        const { orderId, redirectUrl } = await this.paymentsGateway.createOrderSession({
            paymentId: payment.id,
            bookingId: payment.booking_id,
            amount: Number(payment.amount),
            currency: payment.currency,
            userEmail: payment.user_email,
            successUrl: env.FRONT_END_URL + '/order/success',
            cancelUrl: env.FRONT_END_URL + '/order/cancel',
            description: payment.description ?? ''
        })

        await this.paymentsRepository.save({
            ...payment,
            order_id: orderId,
        })

        return {
            redirectUrl,
        }
    }
}