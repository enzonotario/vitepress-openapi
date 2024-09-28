interface SecuritySchemeDefaultValues {
  'http-basic': string
  'http-bearer': string
  'apiKey': string | null
  'openIdConnect': string
  'oauth2': string
}

let securitySchemeDefaultValues: SecuritySchemeDefaultValues = {
  'http-basic': 'Basic Auth',
  'http-bearer': 'Bearer Token',
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

  function getSecuritySchemeDefaultValue(scheme) {
    if (scheme.type === 'http') {
      return securitySchemeDefaultValues[`http-${scheme.scheme}`]
    }

    if (Object.keys(securitySchemeDefaultValues).includes(scheme.type)) {
      return securitySchemeDefaultValues[scheme.type] ?? scheme.name
    }

    return scheme.name ?? ''
  }

  return {
    setSecuritySchemeDefaultValues,
    getSecuritySchemeDefaultValue,
  }
}
