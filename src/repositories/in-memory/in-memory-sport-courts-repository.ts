import { Prisma, type SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"
import { randomUUID } from "crypto"

export class InMemorySportCourtsRepository implements SportCourtsRepository {
    private items: SportCourt[] = []

    async create(data: Prisma.SportCourtCreateInput) {
        const sportCourt = {
            id: data.id ?? randomUUID(),
            title: data.title,
            type: data.type,
            is_active: true,
            phone: data.phone ?? '',
            location: data.location,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            price_per_hour: new Prisma.Decimal(data.price_per_hour.toString())
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