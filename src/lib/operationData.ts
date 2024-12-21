import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ParsedOperation } from '../types'
import { useTheme } from '../composables/useTheme'

export interface OperationData {
  operationId: string
  security: {
    selectedSchemeId: Ref<string>
  }
}

export function initOperationData(operation: ParsedOperation): OperationData {
  const firstSecurityScheme = operation.securityUi?.[0]?.id || ''

  const defaultSecurityScheme = useTheme().getSecurityDefaultScheme() || firstSecurityScheme

  return {
    operationId: operation.operationId,
    security: {
      selectedSchemeId: ref(operation.securityUi?.some(s => s.id === defaultSecurityScheme) ? defaultSecurityScheme : firstSecurityScheme),
    },
  }
}
