import stripe from "root/src/lib/stripe.ts";
import type { CreateChekoutSessionRequest, IPaymentServices } from "../payments-services.ts";

export class StripePaymentServices implements IPaymentServices {
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
            cancel_url: params.cancelUrl
        })

        return {
            sessionId: session.id,
            sessionUrl: session.url!,
        }
    }

}