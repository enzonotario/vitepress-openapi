import { describe, expect, it } from 'vitest'
import { formatJson } from '../../src/lib/formatJson'

describe('formatJson', () => {
  it('formats a valid JSON object with indentation', () => {
    const input = { key: 'value' }
    const output = formatJson(input)
    expect(output).toBe('{\n  "key": "value"\n}')
  })

  it('formats a valid JSON array with indentation', () => {
    const input = [1, 2, 3]
    const output = formatJson(input)
    expect(output).toBe('[\n  1,\n  2,\n  3\n]')
  })

  it('returns an empty object string for invalid JSON', () => {
    const input = undefined
    const output = formatJson(input)
    expect(output).toBe('{}')
  })

  it('formats a nested JSON object with indentation', () => {
    const input = { key: { nestedKey: 'nestedValue' } }
    const output = formatJson(input)
    expect(output).toBe('{\n  "key": {\n    "nestedKey": "nestedValue"\n  }\n}')
  })

  it('formats a JSON object with special characters', () => {
    const input = { key: 'value\nwith\nnewlines' }
    const output = formatJson(input)
    expect(output).toBe('{\n  "key": "value\\nwith\\nnewlines"\n}')
  })
})
