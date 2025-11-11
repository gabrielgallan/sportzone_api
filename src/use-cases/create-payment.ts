import { BookingStatus, type Booking, type Payment } from "@prisma/client"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"
import type { IPaymentServices } from "../payments/payments-services.ts"
import type { UsersRepository } from "../repositories/users-repository.ts"

interface CreatePaymentUseCaseRequest {
    booking: Booking,
}

interface CreatePaymentUseCaseResponse {
    payment: Payment,
    sessionUrl: string
}

export class CreatePaymentUseCase {
    constructor(
        private paymentsRepository: PaymentsRepository,
        private paymentServices: IPaymentServices,
        private usersRepository: UsersRepository
    ) { }

    async execute({
        booking
    }: CreatePaymentUseCaseRequest): Promise<CreatePaymentUseCaseResponse> {
        if (booking.status !== BookingStatus.PENDING) {
            throw new InvalidBookingStatus()
        }

        const user = await this.usersRepository.findByUserId(booking.user_id)

        if (!user) {
            throw new Error()
        }

        const payment = await this.paymentsRepository.create({
            booking_id: booking.id,
            amount: booking.price,
        })

        const { sessionId, sessionUrl } = await this.paymentServices.createCheckoutSession({
            paymentId: payment.id,
            bookingId: booking.id,
            amount: Number(payment.amount),
            currency: 'BRL',
            userEmail: user.email,
            successUrl: '',
            cancelUrl: '',
            description: `Reserva de Quadra`
        })

        const paymentWithSession = await this.paymentsRepository.save({
            ...payment,
            external_id: sessionId
        })

        return {
            payment: paymentWithSession,
            sessionUrl,
        }
    }
}