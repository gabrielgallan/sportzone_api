import request from 'supertest'
import app from 'root/src/app.ts'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { registerAndAuthenticateUser } from 'root/src/utils/test/register-and-authenticate-user.ts'

describe('Create booking (E2E)', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a booking', async () => {
        const { token, user } = await registerAndAuthenticateUser(app, true)

        const now = new Date()

        const _startDate = new Date(now)
        _startDate.setDate(now.getDate() + 1)
        _startDate.setHours(12, 0, 0, 0) // inclui milissegundos = 0

        const _endDate = new Date(now)
        _endDate.setDate(now.getDate() + 1)
        _endDate.setHours(16, 0, 0, 0)

        const startTime = _startDate
        const endTime = _endDate

        const createSportCourt = await request(app.server)
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
            }).expect(201)

        const { sportCourtId } = createSportCourt.body

        const response = await request(app.server)
            .post(`/sport-courts/${sportCourtId}/bookings`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                startTime,
                endTime,
            })
        
        expect(response.body.sessionUrl).toEqual(expect.any(String))
    })
})