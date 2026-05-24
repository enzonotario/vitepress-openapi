import type { PlaygroundExampleBehavior } from '../../composables/useTheme'
import { getPlaygroundSpecificExample, getStandardExample } from '../examples/getPropertyExample'

export function useExampleForPlaceholder(behavior: PlaygroundExampleBehavior): boolean {
  return behavior !== 'ignore'
}

export function useExampleForValue(behavior: PlaygroundExampleBehavior): boolean {
  return behavior === 'value'
}

export function resolveExampleForValue(
  property: any,
  behavior: PlaygroundExampleBehavior,
  xExampleBehavior: PlaygroundExampleBehavior = 'value',
): any {
  if (useExampleForValue(xExampleBehavior)) {
    const specific = getPlaygroundSpecificExample(property)
    if (specific !== null) {
      return specific
    }
  }

  if (useExampleForValue(behavior)) {
    return getStandardExample(property)
  }

  return null
}

export function resolveExampleForPlaceholder(
  property: any,
  behavior: PlaygroundExampleBehavior,
  xExampleBehavior: PlaygroundExampleBehavior = 'value',
): any {
  if (useExampleForPlaceholder(xExampleBehavior)) {
    const specific = getPlaygroundSpecificExample(property)
    if (specific !== null) {
      return specific
    }
  }

  if (useExampleForPlaceholder(behavior)) {
    return getStandardExample(property)
  }

  return null
}
