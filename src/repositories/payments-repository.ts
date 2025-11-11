import type { Payment, Prisma } from "@prisma/client"

export interface PaymentsRepository {
    create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>
    findByExternalId(externalId: string): Promise<Payment | null>
    save(payment: Payment): Promise<Payment>
}