import type { EventBusKey } from '@vueuse/core'
import { useEventBus } from '@vueuse/core'

/**
 * Setup an event bus so we can listen for loaded events.
 */
const lazyEventBusKey: EventBusKey<{ id: string }> = Symbol('lazyEventBus')
export const lazyBus = useEventBus(lazyEventBusKey)
