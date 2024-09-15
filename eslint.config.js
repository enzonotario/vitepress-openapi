// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: false,
    formatters: true,
    lessOpinionated: true,
    rules: {
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    },
  },
)
