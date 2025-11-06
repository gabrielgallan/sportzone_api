import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import prismaTestEnvironment from './prisma/vitest-environment-prisma/prisma-test-environment.ts'


export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/http/controllers/**/*.spec.ts'],
    environment: 'prismaTestEnvironment'
  }
})