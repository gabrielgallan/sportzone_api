import type { Prisma, Payment } from "@prisma/client"
import type { PaymentsRepository } from "../payments-repository.ts"
import { randomUUID } from "crypto"
import { Decimal } from "@prisma/client/runtime/library"


export class InMemoryPaymentsRepository implements PaymentsRepository {
    private items: Payment[] = []
    
    async create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment> {
        const payment = {
            id: data.id ?? randomUUID(),
            method: data.method ?? null,
            external_id: data.external_id ?? null,
            amount: new Decimal(data.amount.toString()),
            created_at: new Date(),
            validated_at: null,
            booking_id: data.booking_id ?? randomUUID()
        }

        this.items.push(payment)

        return payment
    }

    async findByExternalId(externalId: string): Promise<Payment | null> {
        const payment = this.items.find(pay => pay.external_id === externalId)

        if (!payment) return null

        return payment
    }

    async save(payment: Payment): Promise<Payment> {
        const paymentIndex = this.items.findIndex(pay => pay.id === payment.id)

        if (paymentIndex >= 0) {
            this.items[paymentIndex] = payment
        }

        return payment
    }
    
}