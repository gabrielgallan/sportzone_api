import type { Prisma, SportCourt } from "@prisma/client"
import prisma from "root/src/lib/prisma.ts"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"


export class PrismaSportCourtsRepository implements SportCourtsRepository {
    async create(data: Prisma.SportCourtCreateInput): Promise<SportCourt> {
        const sportCourt = await prisma.sportCourt.create({
            data
        })

        return sportCourt
    }

    async findById(id: string) {
        const sportCourt = await prisma.sportCourt.findUnique({
            where: { id }
        })

        return sportCourt
    }
}