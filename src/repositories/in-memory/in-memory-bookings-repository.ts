import type { Prisma, Booking } from "@prisma/client"
import type { BookingsRepository } from "../bookings-repository.ts"
import { randomUUID } from "crypto"
import dayjs from "dayjs"


export class InMemoryBookingsRepository implements BookingsRepository {
    private items: Booking[] = []

    async findManyByUserId(userId: string) {
        const userBookings = this.items.filter(b => b.user_id === userId)

        return userBookings
    }

    async findBySportCourtIdOnInterval(sporCourt_id: string, startDate: Date, endDate: Date) {
        const bookingInTheSameInterval = this.items.find(b =>
            b.sportCourt_id === sporCourt_id &&
            b.start_time < endDate &&
            b.end_time > startDate
        )

        if (!bookingInTheSameInterval) return null

        return bookingInTheSameInterval
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const bookingOnSameDate = this.items.find((booking) => {
            const bookingInDate = dayjs(booking.created_at)
            const isOnSameDate =
                bookingInDate.isAfter(startOfTheDay) && bookingInDate.isBefore(endOfTheDay)

            return booking.user_id === userId && isOnSameDate
        })

        if (!bookingOnSameDate) return null

        return bookingOnSameDate
    }

    async create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking> {
        const booking = {
            id: data.id ?? randomUUID(),
            start_time: new Date(data.start_time),
            end_time: new Date(data.end_time),
            sportCourt_id: data.sportCourt_id,
            user_id: data.user_id,
            status: 'pending',
            created_at: new Date()
        }

        this.items.push(booking)

        return booking
    }
}