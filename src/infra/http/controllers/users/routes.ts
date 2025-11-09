import type { FastifyInstance } from "fastify"
import { verifyJWT } from "@/infra/http/middlewares/verify-jwt.ts"
import { register } from "./register.ts"
import { authenticate } from "./authenticate.ts"
import { profile } from "./profile.ts"
import { refresh } from "./refresh.ts"


export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    app.patch('/token/refresh', refresh)

    /* Authenticated */
    app.get('/my-profile', { onRequest: [verifyJWT] }, profile)
}