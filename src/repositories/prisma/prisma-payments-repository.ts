import { Prisma, type CourtBlockedDate, type Payment } from "@prisma/client"
import type { CourtBlockedDatesRepository } from "../court-blocked-dates-repository.ts"
import prisma from "root/src/lib/prisma.ts"
import type { PaymentsRepository } from "../payments-repository.ts"


export class PrismaPaymentsRepository implements PaymentsRepository {
    async create(data: Prisma.PaymentUncheckedCreateInput) {
        const payment = await prisma.payment.create({
            data
        })
        
        return payment
    }
    
    async findByExternalId(externalId: string) {
        const payment = await prisma.payment.findFirst({
            where: { external_id: externalId }
        })

        return payment
    }

    async save(payment: Payment) {
        const uptPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: payment
        })

        return uptPayment
    }
}