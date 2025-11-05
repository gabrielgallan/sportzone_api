import type { Prisma, SportCourt } from "@prisma/client"
import type { SportCourtsRepository } from "../repositories/sport-courts-repository.ts"

interface SearchCourtsBySportTypeUseCaseRequest {
    type: string,
    page: number
}

interface SearchCourtsBySportTypeUseCaseResponse {
    sportCourts: SportCourt[]
}

export class SearchCourtsBySportTypeUseCase {
    constructor(private sportCourtsRepository: SportCourtsRepository) {}

    async execute({ type, page }: SearchCourtsBySportTypeUseCaseRequest): Promise<SearchCourtsBySportTypeUseCaseResponse> {
        const sportCourts = await this.sportCourtsRepository.searchManyBySportType(type, page)

        return {
            sportCourts,
        }
    }
}