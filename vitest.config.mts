import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Native tsconfig path resolution, so tests can use the same "@/..." imports
  // as application code without an extra plugin.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next', 'lib/generated'],
  },
})
