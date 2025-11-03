import { Prisma, type SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"
import { randomUUID } from "crypto"
import { Decimal } from "@prisma/client/runtime/library"


export class InMemorySportCourtsRepository implements SportCourtsRepository {
    private items: SportCourt[] = []

    async create(data: Prisma.SportCourtCreateInput) {
        const { title, type, location, latitude, longitude, price_per_hour } = data
        const sportCourt = {
            id: randomUUID(),
            title,
            type,
            description: null,
            is_active: true,
            phone: null,
            location,
            latitude,
            longitude,
            price_per_hour: new Prisma.Decimal(String(price_per_hour))
        }

        this.items.push(sportCourt)

        return sportCourt
    }

    async findById(id: string) {
        const sportCourt = this.items.find(court => court.id === id)

        if (!sportCourt) return null

        return sportCourt
    }
}