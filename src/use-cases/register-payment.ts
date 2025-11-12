import { BookingStatus, type Booking, type Payment } from "@prisma/client"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"
import type { IPaymentServices } from "../payments/payments-services.ts"
import type { UsersRepository } from "../repositories/users-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import env from "../env/config.ts"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"

interface RegisterPaymentUseCaseRequest {
    booking: Booking,
}

interface RegisterPaymentUseCaseResponse {
    payment: Payment,
    sessionUrl: string
}

export class RegisterPaymentUseCase {
    constructor(
        private paymentsRepository: PaymentsRepository,
        private paymentServices: IPaymentServices,
        private usersRepository: UsersRepository,
        private sportCourtRepository: SportCourtsRepository
    ) { }

    async execute({
        booking
    }: RegisterPaymentUseCaseRequest): Promise<RegisterPaymentUseCaseResponse> {
        if (booking.status !== BookingStatus.PENDING) {
            throw new InvalidBookingStatus()
        }

        const user = await this.usersRepository.findByUserId(booking.user_id)

        if (!user) {
            throw new ResourceNotFound()
        }

        const sportCourt = await this.sportCourtRepository.findById(booking.sportCourt_id)

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
            successUrl: env.NODE_ENV !== 'production' ? 'https://example.com/success' : env.FRONT_END_URL + '/checkout/success',
            cancelUrl: env.NODE_ENV !== 'production' ? 'https://example.com/cancel' : env.FRONT_END_URL + '/checkout/cancel',
            description: `Reserva de Quadra - ${sportCourt?.title}`
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