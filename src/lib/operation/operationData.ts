import type { Ref } from 'vue'
import type { ParsedOperation } from '../../types'
import type { OARequest } from '../codeSamples/request'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { isLocalStorageAvailable } from '../utils/utils'

export interface OperationData {
  operationId: string
  security: {
    selectedSchemeId: Ref<string>
  }
  playground: {
    request: Ref<OARequest>
    selectedServer: Ref<string>
    parameterValues: Ref<Record<string, any>>
  }
  requestBody: {
    selectedContentType: Ref<string | undefined>
  }
}

export const OPERATION_DATA_KEY = Symbol('operationData')

export function initOperationData({
  operation,
  request,
  selectedServer,
  defaultRequestContentType,
}: {
  operation: ParsedOperation
  request?: OARequest
  selectedServer: string
  defaultRequestContentType: string | undefined
}): OperationData {
  const firstSecurityScheme = operation.securityUi?.[0]?.id || ''

  const defaultSecurityScheme = useTheme().getSecurityDefaultScheme() || firstSecurityScheme

  return {
    operationId: operation.operationId,
    security: {
      selectedSchemeId: ref(operation.securityUi?.some(s => s.id === defaultSecurityScheme) ? defaultSecurityScheme : firstSecurityScheme),
    },
    playground: {
      request: ref(request || {} as OARequest),
      selectedServer: isLocalStorageAvailable()
        ? useStorage(`--oa-operation-${operation.operationId}-selectedServer`, selectedServer, localStorage, {
            mergeDefaults: true,
          })
        : ref(selectedServer),
      parameterValues: ref({}),
    },
    requestBody: {
      selectedContentType: ref(defaultRequestContentType),
    },
  }
}
