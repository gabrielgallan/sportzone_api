import type { Prisma, Booking } from "@prisma/client"
import type { BookingsRepository } from "../bookings-repository.ts";
import prisma from "root/src/lib/prisma.ts";


export class PrismaBookingsRepository implements BookingsRepository {
    async findBySportCourtIdOnDates(sportCourt_id: string, startDate: Date, endDate: Date) {
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                sportCourt_id: sportCourt_id,
                OR: [
                    {
                        start_time: { lt: endDate },
                        end_time: { gt: startDate }
                    }
                ]
            }
        })

        return conflictingBooking
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const booking = await prisma.booking.findFirst({
            where: {
                user_id: userId,
                created_at: date
            }
        })

        return booking
    }

    async create(data: Prisma.BookingUncheckedCreateInput) {
        const booking = await prisma.booking.create({
            data
        })

        return booking
    }
}