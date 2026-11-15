import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import { useTheme } from '../../composables/useTheme'

/** Provided by OASpec when it receives `lazy-rendering`, so it applies per instance, also during SSR. */
export const LAZY_RENDERING_KEY: InjectionKey<boolean | undefined> = Symbol('oa-lazy-rendering')

/** `lazy-rendering` of the closest OASpec, or `spec.lazyRendering` of the theme config. */
export function useLazyRendering(): boolean {
  const fromSpec = inject(LAZY_RENDERING_KEY, undefined)
  return fromSpec ?? useTheme().getSpecConfig()?.lazyRendering?.value ?? false
}
