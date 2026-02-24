import { describe, expect, it } from 'vitest'
import { getSchemaUi } from '../../../src/lib/parser/getSchemaUi'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'
import { specWithCircularRef } from '../../testsConstants'

describe('parseOpenapi circular references', () => {
  it('marks circular references in schema UI', () => {
    const openapi = parseOpenapi().parseSync({ spec: specWithCircularRef })
    const schema = getSchemaUi((openapi as any).components.schemas.Parent)

    const child = (schema as any).properties?.find((p: any) => p.name === 'child')
    const parentProp = child?.properties?.find((p: any) => p.name === 'parent')

    expect(parentProp?.meta?.isCircularReference).toBe(true)
  })
})
