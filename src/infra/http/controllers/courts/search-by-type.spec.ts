import request from 'supertest'
import app from 'root/src/app.ts'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { registerAndAuthenticateUser } from 'root/src/utils/test/register-and-authenticate-user.ts'

describe('Search sport courts by sport type (E2E)', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search sport courts by sport type', async () => {
        const { token } = await registerAndAuthenticateUser(app)

        for (let c = 0; c < 2; c++) {
            await request(app.server).post('/sport-courts')
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
        }

        await request(app.server).post('/sport-courts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Volei SportCourt',
                type: 'Volei',
                phone: '',
                location: 'Nonexisting Street',
                latitude: -23.630180,
                longitude: -46.735809,
                price_per_hour: 20
            })

        const soccerCourts = await request(app.server)
            .post(`/sport-courts/search/type`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'Soccer',
                page: 1
            }).expect(200)

        expect(soccerCourts.body.sportCourts).toHaveLength(2)
    })
})