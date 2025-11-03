export class SportCourtDateUnavaliable extends Error {
    constructor() {
        super('This booking datetime is unavaliable')
    }
}