import { describe, expect, it } from 'vitest'
import {
  resolveExampleForPlaceholder,
  resolveExampleForValue,
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

describe('resolveExampleForValue', () => {
  const property = {
    'x-playground-example': 'x-value',
    'example': 'standard-value',
  }

  it('returns x-playground-example when xExampleBehavior is value (default)', () => {
    expect(resolveExampleForValue(property, 'value', 'value')).toBe('x-value')
  })

  it('returns standard example when xExampleBehavior is placeholder', () => {
    expect(resolveExampleForValue(property, 'value', 'placeholder')).toBe('standard-value')
  })

  it('returns standard example when xExampleBehavior is ignore', () => {
    expect(resolveExampleForValue(property, 'value', 'ignore')).toBe('standard-value')
  })

  it('returns null when both behaviors are placeholder', () => {
    expect(resolveExampleForValue(property, 'placeholder', 'placeholder')).toBeNull()
  })

  it('returns null when both behaviors are ignore', () => {
    expect(resolveExampleForValue(property, 'ignore', 'ignore')).toBeNull()
  })

  it('returns x-playground-example as value even when behavior is placeholder', () => {
    expect(resolveExampleForValue(property, 'placeholder', 'value')).toBe('x-value')
  })

  it('returns null when property has no examples', () => {
    expect(resolveExampleForValue({}, 'value', 'value')).toBeNull()
  })

  it('uses default xExampleBehavior of value when not specified', () => {
    expect(resolveExampleForValue(property, 'value')).toBe('x-value')
  })

  it('falls through to standard example when no x-playground-example', () => {
    const noX = { example: 'standard-value' }
    expect(resolveExampleForValue(noX, 'value', 'value')).toBe('standard-value')
  })
})

describe('resolveExampleForPlaceholder', () => {
  const property = {
    'x-playground-example': 'x-value',
    'example': 'standard-value',
  }

  it('returns x-playground-example when xExampleBehavior is value', () => {
    expect(resolveExampleForPlaceholder(property, 'value', 'value')).toBe('x-value')
  })

  it('returns x-playground-example when xExampleBehavior is placeholder', () => {
    expect(resolveExampleForPlaceholder(property, 'value', 'placeholder')).toBe('x-value')
  })

  it('returns standard example when xExampleBehavior is ignore', () => {
    expect(resolveExampleForPlaceholder(property, 'value', 'ignore')).toBe('standard-value')
  })

  it('returns null when both behaviors are ignore', () => {
    expect(resolveExampleForPlaceholder(property, 'ignore', 'ignore')).toBeNull()
  })

  it('returns standard example as placeholder when behavior is placeholder and xExampleBehavior is ignore', () => {
    expect(resolveExampleForPlaceholder(property, 'placeholder', 'ignore')).toBe('standard-value')
  })

  it('returns null when standard example ignored and no x-playground-example', () => {
    const noX = { example: 'standard-value' }
    expect(resolveExampleForPlaceholder(noX, 'ignore', 'ignore')).toBeNull()
  })
})
