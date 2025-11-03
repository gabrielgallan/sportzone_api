import type { Booking, Prisma } from "@prisma/client"

export interface BookingsRepository {
    create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking>
    findByUserIdOnDate(userId: string, date:  Date): Promise<Booking | null>
    findBySportCourtIdOnDates(sporCourt_id: string, startDate: Date, endDate: Date): Promise<Booking | null>
}