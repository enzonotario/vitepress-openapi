import type { RemovableRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { isLocalStorageAvailable } from '../utils/utils'
import { getAuthorizationStorageKey } from './authPlayground'

type SharedAuthRef = RemovableRef<string> | Ref<string>

const sharedAuthorizationRefs = new Map<string, SharedAuthRef>()

export interface SharedAuthorizationStorageOptions {
  prefix: string
  persist?: boolean
}

/**
 * Returns a process-wide shared ref for a security scheme authorization value.
 * All playgrounds with the same prefix+scheme share one reactive source so
 * token updates (auth modal, clear, typing) sync across operations.
 */
export function useSharedAuthorizationStorage(
  schemeName: string,
  defaultValue: string,
  options: SharedAuthorizationStorageOptions,
): SharedAuthRef {
  const key = getAuthorizationStorageKey(options.prefix, schemeName)
  const existing = sharedAuthorizationRefs.get(key)
  if (existing) {
    return existing
  }

  const persist = options.persist !== false
  const stored = persist && isLocalStorageAvailable()
    ? useStorage(key, defaultValue, localStorage) as RemovableRef<string>
    : ref(defaultValue)

  sharedAuthorizationRefs.set(key, stored)
  return stored
}

export function setSharedAuthorizationValue(
  schemeName: string,
  value: string,
  options: SharedAuthorizationStorageOptions,
): SharedAuthRef {
  const stored = useSharedAuthorizationStorage(schemeName, value, options)
  stored.value = value
  return stored
}

/** Test helper — clears the in-memory shared ref cache. */
export function clearSharedAuthorizationStorage() {
  sharedAuthorizationRefs.clear()
}
