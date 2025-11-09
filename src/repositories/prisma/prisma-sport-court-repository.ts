import type { Prisma, SportCourt } from "@prisma/client"
import prisma from "root/src/lib/prisma.ts"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"
import { getDistanceBetweenCordinates, type Cordinate } from "root/src/utils/get-distance-between-cordinates.ts"


export class PrismaSportCourtsRepository implements SportCourtsRepository {
    async save(sportCourt: SportCourt) {
        const updSportCourt = await prisma.sportCourt.update({
            where: { id: sportCourt.id },
            data: sportCourt
        })

        return updSportCourt
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

    async searchManyByCordinates (
        cord: Cordinate, 
        sportType: string | null, 
        page: number
    ) {
        const sportCourts = sportType ? 
            await prisma.sportCourt.findMany({ where: { type: sportType } }) : 
            await prisma.sportCourt.findMany()

        const nearbySportCourts = sportCourts.filter(court => {
            const distance = getDistanceBetweenCordinates (
                { latitude: cord.latitude, longitude: cord.longitude },
                { latitude: court.latitude.toNumber(), longitude: court.longitude.toNumber() }
            )

            return distance < 10
        }).slice((page - 1) * 20, page * 20)

        return nearbySportCourts
    }
}