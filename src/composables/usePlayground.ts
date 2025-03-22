import type { OpenAPIV3 } from '@scalar/openapi-types'

interface SecuritySchemeDefaultValues {
  'http-basic': string
  'http-bearer': string
  'apiKey': string | null
  'openIdConnect': string
  'oauth2': string
}

let securitySchemeDefaultValues: SecuritySchemeDefaultValues = {
  'http-basic': 'Basic Auth',
  'http-bearer': 'Token',
  'apiKey': null,
  'openIdConnect': 'OpenID Connect',
  'oauth2': 'OAuth2 Token',
}

export function usePlayground() {
  function setSecuritySchemeDefaultValues(values: Partial<SecuritySchemeDefaultValues>) {
    securitySchemeDefaultValues = {
      ...securitySchemeDefaultValues,
      ...values,
    }
  }

  function getSecuritySchemeDefaultValue(scheme: OpenAPIV3.SecuritySchemeObject) {
    if (scheme.type === 'http') {
      const schemeKey = scheme.scheme === 'basic' ? 'http-basic' : 'http-bearer'
      return securitySchemeDefaultValues[schemeKey]
    }

    const schemeType = scheme.type as keyof SecuritySchemeDefaultValues
    if (Object.keys(securitySchemeDefaultValues).includes(schemeType) && securitySchemeDefaultValues[schemeType] !== null) {
      return securitySchemeDefaultValues[schemeType] ?? ''
    }

    if (scheme.type === 'apiKey' && scheme.name) {
      return scheme.name
    }

    return ''
  }

  return {
    setSecuritySchemeDefaultValues,
    getSecuritySchemeDefaultValue,
  }
}
