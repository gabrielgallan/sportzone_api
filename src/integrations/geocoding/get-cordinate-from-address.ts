import axios from 'axios'
import env from 'root/src/env/config.ts'
import type { Cordinate } from 'root/src/utils/get-distance-between-cordinates.ts'
import { HttpGetGeocodingApiFailed } from './errors/http-get-geocoding-failed.ts'
import { AddressNotFound } from './errors/address-not-found.ts'
import { GeocodingRateLimitError } from './errors/rate-limit-error.ts'

export async function GetGeocodingByAddress(address: string): Promise<Cordinate> {
    try {
        const encoded = encodeURIComponent(address)

        const url = `${env.GEOCODING_API_URL}/search?q=${encoded}&format=json&limit=1`

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'SportZone/1.0'
            }
        })

        if (response.status === 429) {
            throw new GeocodingRateLimitError()
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
            err instanceof GeocodingRateLimitError
        ) {
            throw err
        }

        // Erros de rede, timeout, etc.
        throw new HttpGetGeocodingApiFailed(err.message)
    }
}
