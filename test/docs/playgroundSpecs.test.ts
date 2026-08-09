import { describe, expect, it } from 'vitest'
import {
  getDefaultPlaygroundSpecUrl,
  getPlaygroundSpecOptions,
  getPlaygroundSpecSearch,
  resolvePlaygroundSpecUrl,
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

  it('restores the selected spec from the URL query when it is valid', () => {
    const specs = getPlaygroundSpecOptions()

    expect(resolvePlaygroundSpecUrl({
      search: '?spec=https%3A%2F%2Fgalaxy.scalar.com%2Fopenapi.yaml',
      specs,
      defaultSpecUrl: '/openapi.json',
    })).toBe('https://galaxy.scalar.com/openapi.yaml')
  })

  it('falls back to the default spec when the URL query is invalid', () => {
    const specs = getPlaygroundSpecOptions()

    expect(resolvePlaygroundSpecUrl({
      search: '?spec=https%3A%2F%2Finvalid.example%2Fopenapi.json',
      specs,
      defaultSpecUrl: '/openapi.json',
    })).toBe('/openapi.json')
  })

  it('writes a spec query param while preserving unrelated search params', () => {
    expect(getPlaygroundSpecSearch({
      currentSearch: '?foo=bar',
      selectedSpecUrl: 'https://galaxy.scalar.com/openapi.yaml',
      defaultSpecUrl: '/openapi.json',
    })).toBe('?foo=bar&spec=https%3A%2F%2Fgalaxy.scalar.com%2Fopenapi.yaml')
  })

  it('removes the spec query param when the selected spec is the default one', () => {
    expect(getPlaygroundSpecSearch({
      currentSearch: '?foo=bar&spec=https%3A%2F%2Fgalaxy.scalar.com%2Fopenapi.yaml',
      selectedSpecUrl: '/openapi.json',
      defaultSpecUrl: '/openapi.json',
    })).toBe('?foo=bar')
  })
})
