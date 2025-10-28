import type { Prisma, User } from "@prisma/client";
import type { UsersRepository } from "../repositories/users-repository.ts";
import { UserWithSameEmailError } from "./errors/user-with-same-email.ts";
import { hash } from "bcryptjs";

interface RegisterUserCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}


export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterUserCaseRequest): Promise<RegisterUseCaseResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserWithSameEmailError()
        }

        const password_hash = await hash(password, 6)

        const user = await this.usersRepository.create({
            name, email, password_hash
        })

        return { user }
    }
}