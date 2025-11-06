import axios from 'axios'
import env from 'root/src/env/config.ts'
import type { Cordinate } from 'root/src/utils/get-distance-between-cordinates.ts'
import { GeocodingHttpRequestError } from './errors/geocoding-http-request-error.ts'
import { AddressNotFound } from './errors/address-not-found.ts'
import { ResponseRateLimitError } from './errors/response-rate-limit-error.ts'

export async function GetCordinatesByAddress(address: string): Promise<Cordinate> {
    try {
        const encoded = encodeURIComponent(address)

        const url = `${env.GEOCODING_API_URL}/search?q=${encoded}&format=json&limit=1`

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'SportZone API'
            }
        })

        if (response.status === 429) {
            throw new ResponseRateLimitError()
        }

        if (!response.data || response.data.length === 0) {
            throw new AddressNotFound()
        }

        const { lat, lon } = response.data[0]

        return {
            latitude: lat,
            longitude: lon
        }
    } catch (err: any) {
        if (
            err instanceof AddressNotFound ||
            err instanceof ResponseRateLimitError
        ) {
            throw err
        }

        // Erros de rede, timeout, etc.
        throw new GeocodingHttpRequestError(err.message)
    }
}
