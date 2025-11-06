export class ResponseRateLimitError extends Error {
    constructor() {
        super('Geocoding API response rate limit error!')
    }
}