import { afterEach, describe, expect, it, vi } from 'vitest'
import { isLocalStorageAvailable } from '../../../src/lib/utils/utils'

describe('utils', () => {
  describe('isLocalStorageAvailable', () => {
    const originalLocalStorage = globalThis.localStorage

    afterEach(() => {
      if (originalLocalStorage) {
        Object.defineProperty(globalThis, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        })
      }
      else {
        delete (globalThis as any).localStorage
      }
    })

    it('should return false when localStorage is undefined', () => {
      delete (globalThis as any).localStorage
      expect(isLocalStorageAvailable()).toBe(false)
    })

    it('should return false when localStorage exists but getItem is not a function (Node v25 behavior)', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {},
        writable: true,
        configurable: true,
      })
      expect(isLocalStorageAvailable()).toBe(false)
    })

    it('should return false when localStorage.getItem is undefined', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: { getItem: undefined },
        writable: true,
        configurable: true,
      })
      expect(isLocalStorageAvailable()).toBe(false)
    })

    it('should return false when localStorage.getItem is not a function', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: { getItem: 'not a function' },
        writable: true,
        configurable: true,
      })
      expect(isLocalStorageAvailable()).toBe(false)
    })

    it('should return true when localStorage has a proper getItem function', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
        configurable: true,
      })
      expect(isLocalStorageAvailable()).toBe(true)
    })
  })
})

