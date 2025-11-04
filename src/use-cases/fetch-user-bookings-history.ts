import type { User } from "@prisma/client";
import type { UsersRepository } from "../repositories/users-repository.ts"
import { ResourceNotFound } from "./errors/resource-not-found.ts";

interface FetchUserBookingsHistoryUseCaseRequest {
    userId: string
}

interface FetchUserBookingsHistoryUseCaseResponse {
    user: User
}

export class FetchUserBookingsHistoryUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ userId }: FetchUserBookingsHistoryUseCaseRequest): Promise<FetchUserBookingsHistoryUseCaseResponse> {
    
    }
}