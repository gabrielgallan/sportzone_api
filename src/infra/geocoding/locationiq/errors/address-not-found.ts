export class AddressNotFound extends Error {
    constructor() {
        super('Location address not found!')
    }
}