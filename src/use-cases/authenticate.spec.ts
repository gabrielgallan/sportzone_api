import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts'
import { AuthenticateUseCase } from './authenticate.ts'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts'
import type { UsersRepository } from '../repositories/users-repository.ts'
import { hash } from 'bcryptjs'

let usersRepository: UsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        const userCreated = await usersRepository.create({
            name: 'Gabriel',
            email: 'gabriel@email.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email: 'gabriel@email.com',
            password: '123456'
        })

        expect(user.email).toBe(userCreated.email)
    })

    it("should not be able to authenticate with an e-mail doesn't exists", async () => {
        const userCreated = await usersRepository.create({
            name: 'Gabriel',
            email: 'gabriel@email.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => 
            sut.execute({
                email: 'gab@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("should not be able to authenticate with wrong password", async () => {
        const userCreated = await usersRepository.create({
            name: 'Gabriel',
            email: 'gabriel@email.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => 
            sut.execute({
                email: 'gabriel@email.com',
                password: '654321'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})