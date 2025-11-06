import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'


export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/use-cases/**/*.spec.ts'],
    environment: 'node'
  }
})