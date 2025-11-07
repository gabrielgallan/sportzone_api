export class LocationIqServerError extends Error {
    constructor() {
        super('Unknown request to LocationIQ API error!')
    }
}