import { afterEach, describe, expect, it } from 'vitest'
import {
  clearSharedAuthorizationStorage,
  setSharedAuthorizationValue,
  useSharedAuthorizationStorage,
} from '../../../src/lib/playground/sharedAuthorizationStorage'

describe('useSharedAuthorizationStorage', () => {
  afterEach(() => {
    clearSharedAuthorizationStorage()
  })

  it('returns the same ref for the same prefix and scheme', () => {
    const a = useSharedAuthorizationStorage('bearerAuth', 'Token', { prefix: 'vp', persist: false })
    const b = useSharedAuthorizationStorage('bearerAuth', 'OtherDefault', { prefix: 'vp', persist: false })

    expect(a).toBe(b)

    a.value = 'shared-token'
    expect(b.value).toBe('shared-token')
  })

  it('keeps different schemes isolated', () => {
    const bearer = useSharedAuthorizationStorage('bearerAuth', '', { prefix: 'vp', persist: false })
    const apiKey = useSharedAuthorizationStorage('apiKey', '', { prefix: 'vp', persist: false })

    bearer.value = 'bearer-token'
    apiKey.value = 'api-key'

    expect(bearer.value).toBe('bearer-token')
    expect(apiKey.value).toBe('api-key')
  })

  it('setSharedAuthorizationValue updates the shared ref', () => {
    const stored = useSharedAuthorizationStorage('bearerAuth', '', { prefix: 'vp', persist: false })
    setSharedAuthorizationValue('bearerAuth', 'from-modal', { prefix: 'vp', persist: false })
    expect(stored.value).toBe('from-modal')
  })
})
