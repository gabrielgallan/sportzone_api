import type { FastifyReply, FastifyRequest } from "fastify";
import env from "root/src/env/config.ts";
import stripe from "root/src/lib/stripe.ts";
import { makeConfirmBookingUseCase } from "root/src/use-cases/factories/make-confirm-booking-use-case.ts";
import { makeValidatePaymentUseCase } from "root/src/use-cases/factories/make-validate-payment-use-case.ts";
import type Stripe from "stripe";
import z from "zod";

export async function webhook(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const sig = request.headers['stripe-signature']

    let event

    if (!sig) {
        throw new Error()
    }

    try {
        event = stripe.webhooks.constructEvent(
            request.rawBody as Buffer,
            sig,
            env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        return reply.status(400).send(`Webhook Error`)
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session

            const metadataSchema = z.object({
                bookingId: z.string(),
                paymentId: z.string()
            })

            const { bookingId, paymentId } = metadataSchema.parse(session.metadata)

            try {
                const confirmBookingUseCase = makeConfirmBookingUseCase()
                const validatePaymentUseCase = makeValidatePaymentUseCase()

                await confirmBookingUseCase.execute({
                    bookingId,
                })

                await validatePaymentUseCase.execute({
                    paymentId,
                })

                return reply.status(204).send()
            } catch (err) {
                throw err
            }
        case 'checkout.session.async_payment_failed':
            return
        case 'checkout.session.expired':
            return
        case 'checkout.session.async_payment_succeeded':
            return
        default:
            return
    }
}