import type { FastifyInstance } from "fastify"
import { verifyJWT } from "@/infra/http/middlewares/verify-jwt.ts"
import { verifyUserRole } from "../../middlewares/verify-user-role.ts"
import { create } from "./create.ts"


export async function bookingsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/sport-courts/:sportCourtId/bookings', create)
}