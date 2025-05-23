import type { Ref } from 'vue'
import type { ParsedOperation } from '../types'
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'

export interface OperationData {
  operationId: string
  security: {
    selectedSchemeId: Ref<string>
  }
  request: {
    selectedContentType: Ref<string>
  }
}

export const OPERATION_DATA_KEY = Symbol('operationData')

export function initOperationData({ operation }: { operation: ParsedOperation }): OperationData {
  const firstSecurityScheme = operation.securityUi?.[0]?.id || ''

  const defaultSecurityScheme = useTheme().getSecurityDefaultScheme() || firstSecurityScheme

  const requestBodyContentTypes = operation.requestBody ? Object.keys(operation.requestBody.content) : []
  const defaultContentType = requestBodyContentTypes.length ? requestBodyContentTypes[0] : ''

  return {
    operationId: operation.operationId,
    security: {
      selectedSchemeId: ref(operation.securityUi?.some(s => s.id === defaultSecurityScheme) ? defaultSecurityScheme : firstSecurityScheme),
    },
    request: {
      selectedContentType: ref(defaultContentType),
    },
  }
}
