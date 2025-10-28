import axios from 'axios'
import env from 'root/src/env/config.ts'
import { HttpGetGeocodingApiFailed } from './errors/http-get-geocoding-failed.ts'

export async function GetGeocodingByAddress(address: string) {
    try {
        const url = `${env.GEOCODING_API_URL}/search?q=${encodeURIComponent(address)}&format=json`
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'SportZone/1.0'
            }
        })

        const { lat, lon, type, addresstype, name } = response.data[0]

        return { lat, lon, type, addresstype, name }
    } catch (err: any) {
        throw new HttpGetGeocodingApiFailed(err.message)
    }
}

export async function GetAddressByGeoLoc(latitude: number, longitude: number) {
    try {
        const url = `${env.GEOCODING_API_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json`
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'SportZone/1.0'
            }
        })

        return response.data
    } catch (err: any) {
        throw new HttpGetGeocodingApiFailed(err.message)
    }
}