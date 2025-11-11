import { StripePaymentServices } from "root/src/payments/stripe/stripe-payment-services.ts"
import { CreatePaymentUseCase } from "../create-payment.ts"
import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts"
import { PrismaPaymentsRepository } from "root/src/repositories/prisma/prisma-payments-repository.ts"

export function makeCreatePaymentUseCase() {
    const paymentsRepository = new PrismaPaymentsRepository()
    const paymentServices = new StripePaymentServices()
    const usersRepository = new PrismaUsersRepository()

    const createPaymentUseCase = new CreatePaymentUseCase(
        paymentsRepository,
        paymentServices,
        usersRepository
    )

    return createPaymentUseCase
}