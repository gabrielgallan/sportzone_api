import type { Prisma, User } from "@prisma/client";
import prisma from "root/src/lib/prisma.ts";
import type { UsersRepository } from "../users-repository.ts";


export class PrismaUsersRepository implements UsersRepository {
    async create({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data: {
                name, email, password_hash
            }
        })

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        return user
    }
}