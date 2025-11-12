import { CreateCheckoutSessionUseCase } from "../create-checkout-session.ts"
import { PrismaPaymentsRepository } from "root/src/repositories/prisma/prisma-payments-repository.ts"
import { StripePaymentServices } from "../externals/payments-services/stripe/stripe-payment-services.ts"

export function makeCreateCheckoutSessionUseCase() {
    const paymentServices = new StripePaymentServices()
    const paymentsRepository = new PrismaPaymentsRepository()

    const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
        paymentServices,
        paymentsRepository,
    )

    return createCheckoutSessionUseCase
}