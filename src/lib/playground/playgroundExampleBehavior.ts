import type { PlaygroundExampleBehavior } from '../../composables/useTheme'

export function useExampleForPlaceholder(behavior: PlaygroundExampleBehavior): boolean {
  return behavior !== 'ignore'
}

export function useExampleForValue(behavior: PlaygroundExampleBehavior): boolean {
  return behavior === 'value'
}
