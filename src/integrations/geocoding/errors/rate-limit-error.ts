export class GeocodingRateLimitError extends Error {
    constructor() {
        super('Rate limit error!')
    }
}