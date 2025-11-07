import request from 'supertest'
import app from 'root/src/app.ts'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { registerAndAuthenticateUser } from 'root/src/utils/test/register-and-authenticate-user.ts'

describe('Search sport courts by location address (E2E)', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search sport courts by location address', async () => {
        const { token } = await registerAndAuthenticateUser(app)

        await request(app.server).post('/sport-courts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'SportCourt 1',
                type: 'none',
                location: 'Shopping Jardim Sul',
                phone: '',
                latitude: -23.6305222,
                longitude: -46.7361007,
                price_per_hour: 20
            })

        await request(app.server).post('/sport-courts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'SportCourt 2',
                type: 'none',
                location: 'Shopping Center Norte',
                phone: '',
                latitude: -23.5159715,
                longitude: -46.6244467,
                price_per_hour: 20
            })


        const nearCourts = await request(app.server)
            .post(`/sport-courts/search/location`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                routeName: 'Rua Chico Pontes',
                number: 921,
                page: 1
            }).expect(200)

        expect(nearCourts.body.sportCourts).toHaveLength(1)
    })
})