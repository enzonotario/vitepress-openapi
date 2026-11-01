import type { ShikiGrammar } from '../../../src/composables/useTheme'
import { describe, expect, it } from 'vitest'
import {
  collectEmbeddedLangs,
  resolveShikiLanguageSource,
  withRegistryAlias,
} from '../../../src/lib/shiki/resolveGrammar'

const grammar: ShikiGrammar = {
  name: 'tiny',
  scopeName: 'source.tiny',
  patterns: [],
}

describe('resolveShikiLanguageSource', () => {
  it('resolves a grammar object', async () => {
    await expect(resolveShikiLanguageSource(grammar)).resolves.toEqual([grammar])
  })

  it('resolves a grammar array', async () => {
    await expect(resolveShikiLanguageSource([grammar])).resolves.toEqual([grammar])
  })

  it('resolves a sync loader', async () => {
    await expect(resolveShikiLanguageSource(() => grammar)).resolves.toEqual([grammar])
  })

  it('resolves an async module loader', async () => {
    await expect(resolveShikiLanguageSource(async () => ({ default: grammar }))).resolves.toEqual([grammar])
  })
})

describe('withRegistryAlias', () => {
  it('returns the same grammars when the key is already known', () => {
    expect(withRegistryAlias([grammar], 'tiny')).toEqual([grammar])
  })

  it('adds the registry key as an alias when it differs from name', () => {
    expect(withRegistryAlias([grammar], 'tiny-alias')).toEqual([{
      ...grammar,
      aliases: ['tiny-alias'],
    }])
  })

  it('returns empty input unchanged', () => {
    expect(withRegistryAlias([], 'tiny')).toEqual([])
  })
})

describe('collectEmbeddedLangs', () => {
  it('collects unique embedded language ids', () => {
    expect(collectEmbeddedLangs([
      { ...grammar, embeddedLangs: ['javascript', 'json'] },
      { ...grammar, name: 'other', embeddedLanguages: ['json', 'xml'] },
    ])).toEqual(['javascript', 'json', 'xml'])
  })
})
