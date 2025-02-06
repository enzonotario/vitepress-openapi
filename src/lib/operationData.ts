import type { Ref } from 'vue'
import type { ParsedOperation } from '../types'
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

export interface OperationData {
  operationId: string
  security: {
    selectedSchemeId: Ref<string>
  }
}

export const OPERATION_DATA_KEY = Symbol('operationData')

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
