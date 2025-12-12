const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const sharedConfig = require('@caoji/shared/src/eslint.config.js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

module.exports = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/*', 'eslint.config.js', 'prettier.config.js']
  },
  ...compat.config(sharedConfig)
]
