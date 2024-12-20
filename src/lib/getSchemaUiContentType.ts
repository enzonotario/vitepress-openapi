import { getSchemaUiXml } from './getSchemaUiXml'
import { getSchemaUiJson } from './getSchemaUiJson'
import type { OAProperty } from './getSchemaUi'

export function getSchemaUiContentType(contentType: string, uiProperties: OAProperty[] | OAProperty, useExample = false): any {
  if (contentType.toLowerCase().match(/^(text|application)\/.*xml($|;|\\+)/)) {
    return getSchemaUiXml(uiProperties, useExample)
  }

  return getSchemaUiJson(uiProperties, useExample)
}
