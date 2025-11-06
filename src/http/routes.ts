import type { FastifyInstance } from "fastify"
import { register } from "./controllers/register.ts"
import { authenticate } from "./controllers/authenticate.ts"
import { getProfile } from "./controllers/get-profile.ts"
import z from "zod"
import { GetGeocodingByAddress } from "../integrations/geocoding/get-cordinate-from-address.ts"
import { AddressNotFound } from "../integrations/geocoding/errors/address-not-found.ts"
import { HttpGetGeocodingApiFailed } from "../integrations/geocoding/errors/http-get-geocoding-failed.ts"


export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    /* Authenticated */
    app.get('/my-profile', getProfile)
}