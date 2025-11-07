import { defineConfig, defineProject } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    projects: [
      // 🧩 Project 1: Unit tests
      defineProject({
        plugins: [tsconfigPaths()],
        test: {
          name: 'unit',
          include: ['src/use-cases/**/*.spec.ts'],
          environment: 'node',
        },
      }),

      // 🧩 Project 2: E2E tests with Prisma
      defineProject({
        plugins: [tsconfigPaths()],
        test: {
          name: 'E2E',
          include: ['src/http/controllers/**/*.spec.ts'],
          environment: new URL(
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
            import.meta.url,
          ).pathname,
          environmentOptions: {
            prisma: {},
          },
          testTimeout: 60000,
          hookTimeout: 60000,
        },
      }),
    ],
  },
})
