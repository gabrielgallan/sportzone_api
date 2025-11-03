import type { Prisma, Booking } from "@prisma/client"
import type { BookingsRepository } from "../bookings-repository.ts"
import { randomUUID } from "crypto"
import dayjs from "dayjs"


export class InMemoryBookingsRepository implements BookingsRepository {
    private items: Booking[] = []

    async findBySportCourtIdOnDates(sporCourt_id: string, startDate: Date, endDate: Date) {
        const bookingInConflict = this.items.find(b =>
            b.sportCourt_id === sporCourt_id &&
            b.start_time < endDate &&
            b.end_time > startDate
        )

        if (!bookingInConflict) return null

        return bookingInConflict
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
        let { start_time, end_time, sportCourt_id, user_id } = data

        start_time = new Date(start_time)
        end_time = new Date(end_time)

        const booking = {
            id: randomUUID(),
            start_time,
            end_time,
            sportCourt_id,
            user_id,
            status: 'confirmed',
            created_at: new Date()
        }

        this.items.push(booking)

        return booking
    }
}