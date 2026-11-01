import type { ShikiGrammar, ShikiLanguageSource } from '../../composables/useTheme'

function isLanguageModule(value: object): value is { default: ShikiGrammar | ShikiGrammar[] } {
  return 'default' in value && !('scopeName' in value)
}

/**
 * Resolve a registry entry (grammar, array, or loader) into TextMate grammars.
 */
export async function resolveShikiLanguageSource(source: ShikiLanguageSource): Promise<ShikiGrammar[]> {
  const resolved = typeof source === 'function' ? await source() : source
  const grammars = isLanguageModule(resolved) ? resolved.default : resolved
  return Array.isArray(grammars) ? grammars : [grammars]
}

/**
 * Ensure the registry key can be used as a Shiki language id when it differs
 * from the grammar `name` / `aliases`.
 */
export function withRegistryAlias(grammars: ShikiGrammar[], lang: string): ShikiGrammar[] {
  if (grammars.length === 0) {
    return grammars
  }

  const known = grammars.some(grammar => grammar.name === lang || grammar.aliases?.includes(lang))
  if (known) {
    return grammars
  }

  const [first, ...rest] = grammars
  return [{
    ...first,
    aliases: [...(first.aliases ?? []), lang],
  }, ...rest]
}

export function collectEmbeddedLangs(grammars: ShikiGrammar[]): string[] {
  return [...new Set(grammars.flatMap(grammar => [
    ...(grammar.embeddedLangs ?? []),
    ...(grammar.embeddedLanguages ?? []),
  ]))]
}
