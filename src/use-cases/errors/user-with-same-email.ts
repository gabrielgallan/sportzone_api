export class UserWithSameEmailError extends Error {
    constructor(message: string = 'User with same email exists') {
        super(message)
    }
}