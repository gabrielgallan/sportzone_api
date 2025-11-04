import type { Prisma, Booking } from "@prisma/client"
import type { BookingsRepository } from "../bookings-repository.ts";
import prisma from "root/src/lib/prisma.ts";
import dayjs from "dayjs";


export class PrismaBookingsRepository implements BookingsRepository {
    async findManyByUserId(userId: string) {
        const userBookings = await prisma.booking.findMany({
            where: { user_id: userId }
        })

        return userBookings
    }
    
    async findBySportCourtIdOnInterval(sportCourtId: string, startTime: Date, endTime: Date) {
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                sportCourt_id: sportCourtId,
                start_time: { lt: endTime },
                end_time: { gt: startTime }
            }
        })

        return conflictingBooking
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfDay = dayjs(date).startOf("day").toDate()
        const endOfDay = dayjs(date).endOf("day").toDate()

        const booking = await prisma.booking.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay
                }
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