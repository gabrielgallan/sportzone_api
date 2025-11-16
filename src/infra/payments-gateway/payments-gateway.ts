import type { PaymentStatus } from "@prisma/client"

export interface CreateOrderSessionRequest {
    paymentId: string
    bookingId: string
    amount: number
    currency: string
    userEmail: string
    successUrl: string
    cancelUrl: string,
    description: string
}

export interface CreateOrderSessionResponse {
    orderId: string,
    redirectUrl: string
}

export interface CreateRefundIntentResponse {
    refundId: string,
    status: string,
    amount: number,
    createdAt: Date,
}

export interface PaymentGateway {
    createOrderSession(params: CreateOrderSessionRequest): Promise<CreateOrderSessionResponse>
    checkPaymentStatus(externalPaymentId: string): Promise<PaymentStatus>
    createRefund(externalPaymentId: string): Promise<CreateRefundIntentResponse>
}