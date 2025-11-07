export interface GetCordinatesFromAddressServiceRequest {
    address: string
}

export interface GetCordinatesFromAddressServiceResponse {
    latitude: number,
    longitude: number,
    display_name: string
}

export interface GeocodingServices {
    getCordinatesFromAddress({ address }: GetCordinatesFromAddressServiceRequest): Promise<GetCordinatesFromAddressServiceResponse>
}