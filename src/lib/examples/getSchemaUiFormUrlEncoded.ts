import type { OAProperty } from '../parser/getSchemaUi'
import { getSchemaUiJson } from './getSchemaUiJson'

export function getSchemaUiFormUrlEncoded(uiProperties: OAProperty[] | OAProperty, useExample = false): any {
  const uiJson = getSchemaUiJson(uiProperties, useExample)

  return jsonToFormUrlEncoded(uiJson)
}

function jsonToFormUrlEncoded(json: any, prefix = ''): string {
  if (typeof json !== 'object' || json === null) {
    return ''
  }

  const params = new URLSearchParams()

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key]
      const keyWithPrefix = prefix ? `${prefix}[${key}]` : key

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // Handle arrays.
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // For nested objects in arrays, use the array index in the key.
              const nestedParams = jsonToFormUrlEncoded(item, `${keyWithPrefix}[${index}]`)
              if (nestedParams) {
                const nestedParamsObj = new URLSearchParams(nestedParams)
                for (const [nestedKey, nestedValue] of nestedParamsObj.entries()) {
                  params.append(nestedKey, nestedValue)
                }
              }
            } else {
              // For primitive values in arrays.
              params.append(`${keyWithPrefix}[]`, String(item))
            }
          })
        } else {
          // Handle nested objects.
          const nestedParams = jsonToFormUrlEncoded(value, keyWithPrefix)
          if (nestedParams) {
            const nestedParamsObj = new URLSearchParams(nestedParams)
            for (const [nestedKey, nestedValue] of nestedParamsObj.entries()) {
              params.append(nestedKey, nestedValue)
            }
          }
        }
      } else {
        // Handle primitive values.
        params.append(keyWithPrefix, String(value))
      }
    }
  }

  return params.toString()
}
