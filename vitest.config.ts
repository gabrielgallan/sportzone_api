import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,       // (opcional) se quiser usar describe/test/expect sem importar
    environment: 'node',
  },
})