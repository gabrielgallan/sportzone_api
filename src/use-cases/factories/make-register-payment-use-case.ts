import { StripePaymentServices } from "root/src/payments/stripe/stripe-payment-services.ts"
import { RegisterPaymentUseCase } from "../register-payment.ts"
import { PrismaUsersRepository } from "root/src/repositories/prisma/prisma-users-repository.ts"
import { PrismaPaymentsRepository } from "root/src/repositories/prisma/prisma-payments-repository.ts"
import { PrismaSportCourtsRepository } from "root/src/repositories/prisma/prisma-sport-court-repository.ts"

export function makeRegisterPaymentUseCase() {
    const paymentsRepository = new PrismaPaymentsRepository()
    const paymentServices = new StripePaymentServices()
    const usersRepository = new PrismaUsersRepository()
    const sportCourtsRepository = new PrismaSportCourtsRepository()

    const registerPaymentUseCase = new RegisterPaymentUseCase(
        paymentsRepository,
        paymentServices,
        usersRepository,
        sportCourtsRepository
    )

    return registerPaymentUseCase
}