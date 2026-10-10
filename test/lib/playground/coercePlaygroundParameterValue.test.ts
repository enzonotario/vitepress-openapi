import { describe, expect, it } from 'vitest'
import { coercePlaygroundParameterValue, schemaAcceptsStructuredJson, valueFromPlaygroundTextField } from '../../../src/lib/playground/coercePlaygroundParameterValue'

const arraySchema = { type: 'array', items: { type: 'string' } }

describe('coercePlaygroundParameterValue', () => {
  it('parses a JSON array when the schema type is array', () => {
    expect(coercePlaygroundParameterValue(arraySchema, '["important","draft_edited"]')).toEqual([
      'important',
      'draft_edited',
    ])
  })

  it('parses a JSON array when type is an OpenAPI 3.1 type list', () => {
    expect(coercePlaygroundParameterValue({ type: ['array', 'null'], items: { type: 'string' } }, '["important"]')).toEqual([
      'important',
    ])
  })

  it('parses a JSON array when items is set and type is omitted', () => {
    expect(coercePlaygroundParameterValue({ items: { type: 'string' } }, '["important"]')).toEqual(['important'])
  })

  it('keeps incomplete JSON as text', () => {
    expect(coercePlaygroundParameterValue(arraySchema, '["important"')).toBe('["important"')
  })

  it('keeps a plain string when the text is not JSON', () => {
    expect(coercePlaygroundParameterValue(arraySchema, 'important')).toBe('important')
  })

  it('does not parse JSON for a string schema', () => {
    expect(coercePlaygroundParameterValue({ type: 'string' }, '["important","draft"]')).toBe('["important","draft"]')
    expect(schemaAcceptsStructuredJson({ type: 'string' })).toBe(false)
  })

  it('returns an array value unchanged', () => {
    expect(coercePlaygroundParameterValue(arraySchema, ['important', 'draft'])).toEqual(['important', 'draft'])
  })

  it('parses a JSON object when the schema type is object', () => {
    expect(coercePlaygroundParameterValue({ type: 'object' }, '{"author":"Jane"}')).toEqual({ author: 'Jane' })
  })

  it('does not parse an array for an object schema', () => {
    expect(coercePlaygroundParameterValue({ type: 'object' }, '["important"]')).toBe('["important"]')
  })

  it('parses an array when $ref has a local array type', () => {
    const schema = { $ref: '#/components/schemas/Tags', type: 'array', items: { type: 'string' } }
    expect(coercePlaygroundParameterValue(schema, '["important","draft"]')).toEqual(['important', 'draft'])
    expect(valueFromPlaygroundTextField(schema, '["important","draft"]')).toEqual(['important', 'draft'])
  })

  it('does not parse JSON when the schema is only a $ref', () => {
    const schema = { $ref: '#/components/schemas/Tags' }
    expect(coercePlaygroundParameterValue(schema, '["important","draft"]')).toBe('["important","draft"]')
    expect(schemaAcceptsStructuredJson(schema)).toBe(false)
  })
})

describe('valueFromPlaygroundTextField', () => {
  it('parses array JSON from the text field', () => {
    expect(valueFromPlaygroundTextField(arraySchema, '["important","draft_edited"]')).toEqual([
      'important',
      'draft_edited',
    ])
  })

  it('keeps object JSON text when the schema type is an object union', () => {
    expect(valueFromPlaygroundTextField({ type: ['object', 'null'] }, '{"status":"active"}')).toBe('{"status":"active"}')
  })
})
