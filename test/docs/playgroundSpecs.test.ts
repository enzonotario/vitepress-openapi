import { describe, expect, it } from 'vitest'
import {
  getDefaultPlaygroundSpecUrl,
  getPlaygroundSpecOptions,
} from '../../docs/.vitepress/theme/lib/playgroundSpecs'

describe('playground spec selector options', () => {
  it('normalizes local spec URLs and keeps the options sorted by name', () => {
    const specs = getPlaygroundSpecOptions()
    const names = specs.map(spec => spec.name)

    expect(specs).toContainEqual({
      name: 'Argentine Rock Legends',
      url: '/openapi.json',
    })

    expect(specs).toContainEqual({
      name: 'Response Types',
      url: '/openapi-response-types.json',
    })

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('keeps the documented default spec selected when it is available', () => {
    const specs = getPlaygroundSpecOptions()

    expect(getDefaultPlaygroundSpecUrl(specs)).toBe('/openapi.json')
  })
})
