import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { SecurityUi, SecurityUiItem } from '../../types'

const NO_SECURITY = 'None'

export function getSecurityUi(security: OpenAPIV3.SecuritySchemeObject[], securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject>): SecurityUi {
  const securityUi: SecurityUi = []

  if (!security) {
    return securityUi
  }

  security.forEach((securityOption) => {
    const andItems = {
      id: Object.keys(securityOption).length ? Object.keys(securityOption).join('|') : NO_SECURITY,
      schemes: {},
    } as SecurityUiItem

    Object.keys(securityOption).forEach((key) => {
      if (securitySchemes && securitySchemes[key]) {
        andItems.schemes[key] = securitySchemes[key]
      }
    })

    securityUi.push(andItems)
  })

  if (securityUi.length === 1 && securityUi[0].id === NO_SECURITY && Object.keys(securityUi[0].schemes).length === 0) {
    return []
  }

  return securityUi
}
