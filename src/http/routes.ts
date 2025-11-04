import type { FastifyInstance } from "fastify"
import { register } from "./controllers/register.ts"
import { authenticate } from "./controllers/authenticate.ts"
import { getProfile } from "./controllers/get-profile.ts"
import { GetAddressByGeoLoc, GetGeocodingByAddress } from "../integrations/nominatim/geocoding.ts"
import z from "zod"


export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)
    app.get('/profile', getProfile)
}