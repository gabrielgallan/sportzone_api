import type { FastifyInstance } from "fastify"
import { register } from "./controllers/register.ts"
import { authenticate } from "./controllers/authenticate.ts"
import { getProfile } from "./controllers/get-profile.ts"
import z from "zod"
import { GetGeocodingByAddress } from "../integrations/geocoding/get-cordinate-from-address.ts"
import { GetAddressByGeoLoc } from "../integrations/geocoding/get-address-from-cordinates.ts"
import { AddressNotFound } from "../integrations/geocoding/errors/address-not-found.ts"
import { HttpGetGeocodingApiFailed } from "../integrations/geocoding/errors/http-get-geocoding-failed.ts"


export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)
    app.get('/profile', getProfile)

    app.post('/address-consult', async (request, reply) => {
        const bodySchema = z.object({
            address: z.string()
        })

        const { address } = bodySchema.parse(request.body)

        try {
            const response = await GetGeocodingByAddress(address)
            reply.status(200).send(response)
        } catch (err) {
            if (err instanceof AddressNotFound) {
                reply.status(404).send({ error: err.message })
            }

            if (err instanceof HttpGetGeocodingApiFailed) {
                reply.status(500).send({ error: err.message })
            }

            throw err
        }        
    })
}