import type { Ref } from 'vue'
import type { ParsedOperation } from '../types'
import { inject, provide } from 'vue'

export const PLAYGROUND_DATA_INJECTION_KEY = Symbol('playgroundData')

export interface PlaygroundData {
  selectedOperation: Ref<ParsedOperation | null>
}

export function providePlaygroundData(data: PlaygroundData) {
  provide(PLAYGROUND_DATA_INJECTION_KEY, data)
}

export function usePlaygroundData(): PlaygroundData {
  const data = inject<PlaygroundData>(PLAYGROUND_DATA_INJECTION_KEY)
  if (!data) {
    throw new Error('Playground data not provided')
  }
  return data
}
