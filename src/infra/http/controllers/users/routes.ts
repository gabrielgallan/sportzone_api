import type { FastifyInstance } from "fastify"
import { register } from "./register.ts"
import { authenticate } from "./authenticate.ts"
import { profile } from "./profile.ts"
import { verifyJWT } from "@/infra/http/middlewares/verify-jwt.ts"


export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    /* Authenticated */
    app.get('/my-profile', { onRequest: [verifyJWT] }, profile)
}