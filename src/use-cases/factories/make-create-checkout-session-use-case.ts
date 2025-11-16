import { CreateCheckoutSessionUseCase } from "../create-order-session.ts"
import { PrismaPaymentsRepository } from "root/src/repositories/prisma/prisma-payments-repository.ts"
import { StripePaymentsGateway } from "../../infra/payments-gateway/stripe/stripe-payments-gateway.ts"

export function makeCreateCheckoutSessionUseCase() {
    const paymentGateway = new StripePaymentsGateway()
    const paymentsRepository = new PrismaPaymentsRepository()

    const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
        paymentGateway,
        paymentsRepository,
    )

    return createCheckoutSessionUseCase
}