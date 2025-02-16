import type { OAProperty } from '../processOpenAPI/getSchemaUi'
import { jsXml } from 'json-xml-parse'
import { getSchemaUiJson } from './getSchemaUiJson'

export function getSchemaUiXml(uiProperties: OAProperty[] | OAProperty, useExample = false): any {
  const uiJson = getSchemaUiJson(uiProperties, useExample)

  return jsXml.toXmlString(uiJson)
}
