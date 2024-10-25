import { describe, expect, it } from 'vitest'
import { formatJsonWithCircularRef } from '../../src/lib/formatJsonWithCircularRef'

describe('formatJsonWithCircularRef', () => {
  it('formats a JSON object with circular reference', () => {
    const input: any = { key: 'value' }
    input.circular = input
    const output = formatJsonWithCircularRef(input)
    expect(output).toBe(`{
  "key": "value",
  "circular": "[Circular]"
}`)
  })
})
