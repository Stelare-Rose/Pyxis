// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).prepend({
  ignores: [
    'src-tauri/**',
    '.nuxt/**',
    'node_modules/**',
    'dist/**',
    'output/**',
    '.output/**',
  ],
}).override('nuxt/stylistic', {
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/no-tabs': 'off',
  },
})
