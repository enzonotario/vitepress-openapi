import { getSchemaUiXml } from './getSchemaUiXml'
import { getSchemaUiJson } from './getSchemaUiJson'
import type { OAProperty } from './getSchemaUi'

export function getSchemaUiContentType(contentType: string, uiProperties: OAProperty[] | OAProperty, useExample = false): any {
  switch (contentType) {
    case 'application/xml':
      return getSchemaUiXml(uiProperties, useExample)
    case 'application/json':
    default: {
      return getSchemaUiJson(uiProperties, useExample)
    }
  }
}
