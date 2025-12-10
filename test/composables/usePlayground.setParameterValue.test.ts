import type { OperationData } from '../../src/lib/operation/operationData'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const mockInject = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    get inject() {
      return mockInject
    },
  }
})

describe('usePlayground setParameterValue', () => {
  let mockOperationData: OperationData
  let mockParameterValues: ReturnType<typeof ref<Record<string, any>>>

  beforeEach(() => {
    vi.clearAllMocks()
    mockParameterValues = ref({})
    mockOperationData = {
      operationId: 'testOperation',
      security: {
        selectedSchemeId: ref(''),
      },
      playground: {
        request: ref({}),
        selectedServer: ref('https://api.example.com'),
        parameterValues: mockParameterValues,
      },
      requestBody: {
        selectedContentType: ref(undefined),
      },
    }

    mockInject.mockReturnValue(mockOperationData)
  })

  it('should set string parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('testParam', 'testValue')

    expect(mockParameterValues.value.testParam).toBe('testValue')
  })

  it('should set number parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('count', 42)

    expect(mockParameterValues.value.count).toBe(42)
  })

  it('should set boolean parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('enabled', true)

    expect(mockParameterValues.value.enabled).toBe(true)
  })

  it('should deep clone object parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    const originalObject = { name: 'test', nested: { value: 123 } }
    playground.setParameterValue('config', originalObject)

    expect(mockParameterValues.value.config).toEqual(originalObject)
    expect(mockParameterValues.value.config).not.toBe(originalObject)
    expect(mockParameterValues.value.config.nested).not.toBe(originalObject.nested)
  })

  it('should deep clone array parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    const originalArray = [1, 2, { nested: 'value' }]
    playground.setParameterValue('items', originalArray)

    expect(mockParameterValues.value.items).toEqual(originalArray)
    expect(mockParameterValues.value.items).not.toBe(originalArray)
    expect(mockParameterValues.value.items[2]).not.toBe(originalArray[2])
  })

  it('should not set value when operationData is undefined', async () => {
    mockInject.mockReturnValue(undefined)
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('testParam', 'testValue')

    expect(mockParameterValues.value.testParam).toBeUndefined()
  })

  it('should not set value when parameterName is empty', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('', 'testValue')

    expect(Object.keys(mockParameterValues.value)).toHaveLength(0)
  })

  it('should handle null value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('nullable', null)

    expect(mockParameterValues.value.nullable).toBeNull()
  })

  it('should overwrite existing parameter value', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    mockParameterValues.value.existing = 'oldValue'
    playground.setParameterValue('existing', 'newValue')

    expect(mockParameterValues.value.existing).toBe('newValue')
  })

  it('should set multiple parameter values', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    playground.setParameterValue('param1', 'value1')
    playground.setParameterValue('param2', 42)
    playground.setParameterValue('param3', { nested: 'object' })

    expect(mockParameterValues.value.param1).toBe('value1')
    expect(mockParameterValues.value.param2).toBe(42)
    expect(mockParameterValues.value.param3).toEqual({ nested: 'object' })
  })

  it('should return hasOperationData as true when operationData exists', async () => {
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    expect(playground.hasOperationData).toBe(true)
  })

  it('should return hasOperationData as false when operationData is undefined', async () => {
    mockInject.mockReturnValue(undefined)
    const { usePlayground } = await import('../../src/composables/usePlayground')
    const playground = usePlayground()
    expect(playground.hasOperationData).toBe(false)
  })
})
