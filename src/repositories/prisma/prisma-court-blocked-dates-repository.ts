import { Prisma } from "@prisma/client"
import type { CourtBlockedDatesRepository } from "../court-blocked-dates-repository.ts"
import prisma from "root/src/lib/prisma.ts"


export class PrismaCourtBlockedDatesRepository implements CourtBlockedDatesRepository {
    async create(data: Prisma.CourtBlockedDateUncheckedCreateInput) {
        const courtBlockedDate = await prisma.courtBlockedDate.create({
            data
        })

        return courtBlockedDate
    }

    async findManyBySportCourtId(sportCourtId: string) {
        const blockedDates = await prisma.courtBlockedDate.findMany({
            where: { 
                sportCourt_id: sportCourtId
            }
        })

        return blockedDates
    }
}