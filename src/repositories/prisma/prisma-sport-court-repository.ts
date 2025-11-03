import type { Prisma, SportCourt } from "@prisma/client"
import prisma from "root/src/lib/prisma.ts"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"


export class PrismaSportCourtsRepository implements SportCourtsRepository {
    create(data: Prisma.SportCourtCreateInput): Promise<SportCourt> {
        throw new Error("Method not implemented.")
    }

    async findById(id: string) {
        const sportCourt = await prisma.sportCourt.findUnique({
            where: { id }
        })

        return sportCourt
    }
}