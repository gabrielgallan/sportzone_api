import type { SportCourt, Prisma } from "@prisma/client"
import type { Cordinate } from "../utils/get-distance-between-cordinates.ts"

export interface SportCourtsRepository {
    create(data: Prisma.SportCourtCreateInput): Promise<SportCourt>
    findById(id: string): Promise<SportCourt | null>
    searchManyBySportType(type: string, page: number): Promise<SportCourt[]>
    searchManyNearby(data: Cordinate, page: number): Promise<SportCourt[]>
    save(sportCourt: SportCourt): Promise<SportCourt>
}