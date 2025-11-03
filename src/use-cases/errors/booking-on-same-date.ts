export class BookingOnSameDate extends Error {
    constructor() {
        super('A booking created today already exists!')
    }
}