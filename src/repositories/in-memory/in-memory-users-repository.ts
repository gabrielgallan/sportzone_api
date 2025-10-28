import type { Prisma, User } from "@prisma/client";
import prisma from "root/src/lib/prisma.ts";
import type { UsersRepository } from "../users-repository.ts";
import { randomUUID } from "crypto";


export class InMemoryUsersRepository implements UsersRepository {
    constructor(private items: User[]) {}

    async create(data: Prisma.UserCreateInput) {
        const { name, email, password_hash } = data

        const user = {
            id: randomUUID(),
            name,
            email,
            password_hash,
            created_at: new Date()
        }

        this.items.push(user)

        return user
    }

    async findByEmail(email: string) {
        const user = this.items.find(user => user.email === email)

        if (!user) return null

        return user
    }
}