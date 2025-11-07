import { Prisma, type SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../sport-courts-repository.ts"
import { randomUUID } from "crypto"
import { getDistanceBetweenCordinates, type Cordinate } from "root/src/utils/get-distance-between-cordinates.ts"

export class InMemorySportCourtsRepository implements SportCourtsRepository {
    private items: SportCourt[] = []
    
    async searchManyNearby(data: Cordinate, page: number) {
        const nearbySportCourts = this.items.filter(court => {
            const distance = getDistanceBetweenCordinates(
                { latitude: data.latitude, longitude: data.longitude },
                { latitude: court.latitude.toNumber(), longitude: court.longitude.toNumber() }
            )
            
            return distance < 10
        }).slice((page - 1) * 20, page * 20)
        
        return nearbySportCourts
    }
    
    async searchAll() {
        return this.items
    }

    async searchManyBySportType(type: string, page: number) {
        const sportCourts = this.items
        .filter(court => court.type.toLowerCase().includes(
            type.toLowerCase()
        ))
        .slice((page - 1) * 20, page * 20)
        
        return sportCourts
    }
    
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

    async save(sportCourt: SportCourt) {
        const courtIndex = this.items.findIndex(c => c.id === sportCourt.id)

        if (courtIndex >= 0) {
            this.items[courtIndex] = sportCourt
        }

        return sportCourt
    }
}