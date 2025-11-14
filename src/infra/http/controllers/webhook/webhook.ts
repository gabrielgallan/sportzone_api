import type { FastifyReply, FastifyRequest } from "fastify";
import env from "root/src/env/config.ts";
import stripe from "root/src/lib/stripe.ts";
import { makeConfirmBookingUseCase } from "root/src/use-cases/factories/make-confirm-booking-use-case.ts";
import { makeThrowErrorOnBookingUseCase } from "root/src/use-cases/factories/make-throw-error-on-booing-use-case.ts";
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

    const session = event.data.object as Stripe.Checkout.Session

    const metadataSchema = z.object({
        bookingId: z.string(),
        paymentId: z.string()
    })

    const { bookingId, paymentId } = metadataSchema.parse(session.metadata)

    const confirmBookingUseCase = makeConfirmBookingUseCase()
    const validatePaymentUseCase = makeValidatePaymentUseCase()
    const throwErrorOnBookingUseCase = makeThrowErrorOnBookingUseCase()

    switch (event.type) {
        case 'checkout.session.completed':
            await validatePaymentUseCase.execute({
                paymentId,
            })

            await confirmBookingUseCase.execute({
                bookingId,
            })

            return reply.status(200).send()
        case 'checkout.session.async_payment_failed':
            await throwErrorOnBookingUseCase.execute({
                bookingId
            })

            return reply.status(200).send()
        case 'checkout.session.expired':
            await throwErrorOnBookingUseCase.execute({
                bookingId
            })
            
            return reply.status(200).send()
        case 'checkout.session.async_payment_succeeded':
            await validatePaymentUseCase.execute({
                paymentId,
            })

            await confirmBookingUseCase.execute({
                bookingId,
            })
            return reply.status(200).send()
        default:
            return reply.status(200).send()
    }
}