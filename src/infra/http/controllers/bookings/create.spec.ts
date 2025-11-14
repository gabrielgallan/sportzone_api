import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import app from 'root/src/app.ts'
import { registerAndAuthenticateUser } from 'root/src/utils/test/e2e/register-and-authenticate-user.ts'
import { createSportCourt } from 'root/src/utils/test/e2e/create-sport-court.ts'
import dayjs from 'dayjs'


describe('Create booking (E2E)', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a booking', async () => {
        const { token } = await registerAndAuthenticateUser(app, true)
        const { sportCourtId } = await createSportCourt(app, token)

        const startTime = dayjs().add(1, "day").hour(12).minute(0).second(0).millisecond(0).toDate() // Tomorrow at twelve PM o'clock
        const endTime = dayjs().add(1, "day").hour(16).minute(0).second(0).millisecond(0).toDate() // Tomorrow at four PM o'clock

        const response = await request(app.server)
            .post(`/sport-courts/${sportCourtId}/bookings`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                startTime,
                endTime,
            })
        
        expect(response.body.sessionUrl).toEqual(expect.any(String))
        expect(response.body.sessionId).toEqual(expect.any(String))
    })
})