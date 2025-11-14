import type { FastifyInstance } from "fastify"
import request from "supertest"

export async function createSportCourt(app: FastifyInstance, token: string) {
    const response = await request(app.server)
        .post('/sport-courts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Soccer SportCourt',
            type: 'Soccer',
            phone: '',
            location: 'Nonexisting Street',
            latitude: -23.630180,
            longitude: -46.735809,
            price_per_hour: 20
        })

    return {
        sportCourtId: response.body.sportCourtId,
    }
}