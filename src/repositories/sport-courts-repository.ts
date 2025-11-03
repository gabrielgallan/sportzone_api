import type { SportCourt, Prisma } from "@prisma/client"

export interface SportCourtsRepository {
    create(data: Prisma.SportCourtCreateInput): Promise<SportCourt>
    findById(id: string): Promise<SportCourt | null>
}