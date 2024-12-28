import { ref } from 'vue'

const currentScope = ref('global')

export function useScopeConfiguration() {
  return {
    currentScope,
  }
}
