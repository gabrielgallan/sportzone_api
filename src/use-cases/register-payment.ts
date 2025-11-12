import { BookingStatus, type Booking, type Payment } from "@prisma/client"
import { InvalidBookingStatus } from "./errors/invalid-booking-status-error.ts"
import type { PaymentsRepository } from "../repositories/payments-repository.ts"
import type { UsersRepository } from "../repositories/users-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"

interface RegisterPaymentUseCaseRequest {
    booking: Booking,
}

interface RegisterPaymentUseCaseResponse {
    payment: Payment,
}

export class RegisterPaymentUseCase {
    constructor(
        private paymentsRepository: PaymentsRepository,
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

        if (!sportCourt) {
            throw new ResourceNotFound()
        }

        const payment = await this.paymentsRepository.create({
            amount: booking.price,
            currency: 'brl',
            description: `Reserva de Quadra - ${sportCourt.title}`,
            user_email: user.email,
            booking_id: booking.id,
        })

        return {
            payment,
        }
    }
}