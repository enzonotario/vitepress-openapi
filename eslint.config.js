// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: false,
    formatters: true,
    lessOpinionated: true,
    rules: {
      'style/brace-style': 'off',
    },
    stylistic: {
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  },
)
