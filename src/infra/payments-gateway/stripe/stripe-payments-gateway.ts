import stripe from "root/src/lib/stripe.ts";
import type { CreateChekoutSessionRequest, PaymentGateway } from "../payments-gateway.ts";

const timeLimitForExpirationInMinutes = 35

export class StripePaymentsGateway implements PaymentGateway {
    async createCheckoutSession(params: CreateChekoutSessionRequest) {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: params.userEmail,
            line_items: [
                {
                    price_data: {
                        currency: params.currency,
                        product_data: {
                            name: params.description,
                        },
                        unit_amount: Math.round(params.amount * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                paymentId: params.paymentId,
                bookingId: params.bookingId,
            },
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            expires_at: Math.floor(Date.now() / 1000) + timeLimitForExpirationInMinutes * 60,
        })

        return {
            sessionId: session.id,
            sessionUrl: session.url!,
        }
    }

}