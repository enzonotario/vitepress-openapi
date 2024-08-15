import pluginJs from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default ts.config(
    pluginJs.configs.recommended,
    ...ts.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    {
      files: ['*.vue', '**/*.vue'],
      languageOptions: {
        parserOptions: {
          parser: '@typescript-eslint/parser'
        }
      }
    }
)
