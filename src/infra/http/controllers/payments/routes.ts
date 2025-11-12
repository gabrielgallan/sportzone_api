import type { FastifyInstance } from "fastify"
import { webhook } from "./webhook.ts"


export async function paymentRoutes(app: FastifyInstance) {

    app.route({
        method: 'POST',
        url: '/stripe/webhook',
        config: {
            rawBody: true
        },
        handler: webhook
    })

}