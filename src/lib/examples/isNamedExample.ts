import type { NormalizedExample } from './normalizeExamples'

export function isNamedExample(example: NormalizedExample): boolean {
  const stringifiedValue = typeof example.value === 'object'
    ? JSON.stringify(example.value)
    : String(example.value)

  return example.name !== stringifiedValue
}

export function hasNamedExamples(examples: NormalizedExample[] | null): boolean {
  if (!examples || examples.length === 0) {
    return false
  }

  return examples.some(isNamedExample)
}
