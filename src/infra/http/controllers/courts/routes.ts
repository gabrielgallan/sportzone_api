import type { FastifyInstance } from "fastify"
import { verifyJWT } from "@/infra/http/middlewares/verify-jwt.ts"
import { verifyUserRole } from "../../middlewares/verify-user-role.ts"
import { create } from "./create.ts"
import { nearby } from "./nearby.ts"
import { query } from "./search-by-query.ts"
import { restrict } from "./restrict.ts"
import { disable } from "./disable.ts"
import { activate } from "./activate.ts"


export async function courtRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/sport-courts', { onRequest: [verifyUserRole('ADMIN')] }, create)
    
    app.get('/sport-courts/search/nearby', nearby)
    app.get('/sport-courts/search', query)
    
    app.post('/sport-courts/:sportCourtId/restriction', { onRequest: [verifyUserRole('ADMIN')] }, restrict)
    app.patch('/sport-courts/:sportCourtId/availability', { onRequest: [verifyUserRole('ADMIN')] }, disable)
    app.patch('/sport-courts/:sportCourtId/unavailability', { onRequest: [verifyUserRole('ADMIN')] }, activate)
}