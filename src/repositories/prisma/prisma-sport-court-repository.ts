import type { Prisma, SportCourt } from "@prisma/client"
import prisma from "root/src/lib/prisma.ts"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"


export class PrismaSportCourtsRepository implements SportCourtsRepository {
    async searchManyBySportType(type: string, page: number) {
        const sportCourts = await prisma.sportCourt.findMany({
            where: {
                type: {
                    contains: type,
                    mode: 'insensitive', // ignora maiúsculas e minúsculas
                },
            },
            skip: (page - 1) * 20, // pula os registros das páginas anteriores
            take: 20,
        })

        return sportCourts
    }


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