import 'dotenv/config'
import { randomUUID } from 'crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseURL(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Provide a DATABASE_URL on environment variables!')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    async setup() {
        console.log('Setup')
        const schema = randomUUID()

        console.log(generateDatabaseURL(schema))

        return {
            teardown() {
                console.log('Teardown')
            }
        }
    }
}