import { ValidatePaymentUseCase } from "../validate-payment.ts"
import { PrismaPaymentsRepository } from "root/src/repositories/prisma/prisma-payments-repository.ts"

export function makeValidatePaymentUseCase() {
    const paymentsRepository = new PrismaPaymentsRepository()

    const validatePaymentUseCase = new ValidatePaymentUseCase(
        paymentsRepository,
    )

    return validatePaymentUseCase
}