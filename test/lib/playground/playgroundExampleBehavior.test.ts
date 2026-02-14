import { describe, expect, it } from 'vitest'
import {
  useExampleForPlaceholder,
  useExampleForValue,
} from '../../../src/lib/playground/playgroundExampleBehavior'

describe('useExampleForPlaceholder', () => {
  it('returns true for value', () => {
    expect(useExampleForPlaceholder('value')).toBe(true)
  })

  it('returns true for placeholder', () => {
    expect(useExampleForPlaceholder('placeholder')).toBe(true)
  })

  it('returns false for ignore', () => {
    expect(useExampleForPlaceholder('ignore')).toBe(false)
  })
})

describe('useExampleForValue', () => {
  it('returns true for value', () => {
    expect(useExampleForValue('value')).toBe(true)
  })

  it('returns false for placeholder', () => {
    expect(useExampleForValue('placeholder')).toBe(false)
  })

  it('returns false for ignore', () => {
    expect(useExampleForValue('ignore')).toBe(false)
  })
})
