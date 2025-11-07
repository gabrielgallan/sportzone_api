import request from 'supertest'
import app from 'root/src/app.ts'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { registerAndAuthenticateUser } from 'root/src/utils/test/register-and-authenticate-user.ts'

describe('Restrict sport court date (E2E)', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it.skip('should be able to restrict sport court date', async () => {
        const { token } = await registerAndAuthenticateUser(app)

        const response = await request(app.server).post('/sport-courts')
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

        const { sportCourtId } = response.body

        await request(app.server)
            .post(`/sport-courts/${sportCourtId}/restrict`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                startDate: new Date(2025, 10, 10, 12, 0).toISOString(),
                endDate: new Date(2025, 10, 10, 18, 0).toISOString()
            }).expect(201)
    })
})