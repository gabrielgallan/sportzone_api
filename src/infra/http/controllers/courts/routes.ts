import type { FastifyInstance } from "fastify"
import { verifyJWT } from "@/infra/http/middlewares/verify-jwt.ts"
import { create } from "./create.ts"
import { nearby } from "./nearby.ts"
import { findLocation } from "./search-by-location.ts"
import { findType } from "./search-by-type.ts"
import { restrict } from "./restrict.ts"
import { disable } from "./disable.ts"


export async function courtRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/sport-courts', create)
    
    app.post('/sport-courts/search/nearby', nearby)
    app.post('/sport-courts/search/local', findLocation)
    app.post('/sport-courts/search/type', findType)
    
    app.post('/sport-courts/:sportCourtId/restriction', restrict)
    app.patch('/sport-courts/:sportCourtId/availability', disable)
}