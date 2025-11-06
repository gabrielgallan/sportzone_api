import type { FastifyInstance } from "fastify"
import { register } from "./controllers/register.ts"
import { authenticate } from "./controllers/authenticate.ts"
import { getProfile } from "./controllers/get-profile.ts"
import { verifyJWT } from "./middlewares/verify-jwt.ts"


export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    /* Authenticated */
    app.get('/my-profile', { onRequest: [verifyJWT] }, getProfile)
}