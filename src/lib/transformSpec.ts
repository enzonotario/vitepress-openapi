import { generateMissingOperationIds } from './generateMissingOperationIds'
import { generateMissingSummary } from './generateMissingSummary'
import { generateMissingTags } from './generateMissingTags'

export function transformSpec(spec) {
  if (import.meta.env.VITE_DEBUG) {
    console.warn('Transforming OpenAPI spec:', spec)
  }

  if (!spec) {
    return
  }

  if (!spec.openapi || !spec.openapi.startsWith('3.')) {
    throw new Error('Only OpenAPI 3.x is supported')
  }

  if (spec?.paths) {
    spec = generateMissingOperationIds(spec)
    spec = generateMissingSummary(spec)
    spec = generateMissingTags(spec)
  }

  return Object.assign({}, spec)
}
