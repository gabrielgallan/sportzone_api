export class HttpGetGeocodingApiFailed extends Error {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, HttpGetGeocodingApiFailed.prototype)
    }
}