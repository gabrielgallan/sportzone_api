export interface CreateChekoutSessionRequest {
    paymentId: string
    bookingId: string
    amount: number
    currency: string
    userEmail: string
    successUrl: string
    cancelUrl: string,
    description: string
}

interface CreateChekoutSessionResponse {
    sessionId: string
    sessionUrl: string
}

export interface PaymentServices {
    createCheckoutSession(params: CreateChekoutSessionRequest): Promise<CreateChekoutSessionResponse>
}