import { describe, expect, it } from 'vitest'
import { getPropertyExample } from '../../../src/lib/examples/getPropertyExample'

describe('getPropertyExample', () => {
  it('returns the x-playground-example property if it exists', () => {
    const property = {
      'x-playground-example': 'playgroundExample',
      'example': 'exampleValue',
    }
    expect(getPropertyExample(property)).toBe('playgroundExample')
  })

  it('returns the schema.x-playground-example property if it exists', () => {
    const property = {
      schema: {
        'x-playground-example': 'schemaPlaygroundExample',
        'example': 'schemaExample',
      },
      example: 'exampleValue',
    }
    expect(getPropertyExample(property)).toBe('schemaPlaygroundExample')
  })

  it('prioritizes x-playground-example over schema.x-playground-example', () => {
    const property = {
      'x-playground-example': 'playgroundExample',
      'schema': {
        'x-playground-example': 'schemaPlaygroundExample',
        'example': 'schemaExample',
      },
      'example': 'exampleValue',
    }
    expect(getPropertyExample(property)).toBe('playgroundExample')
  })

  it('returns the example property if it exists', () => {
    const property = { example: 'exampleValue' }
    expect(getPropertyExample(property)).toBe('exampleValue')
  })

  it('returns the first example from examples array if example property does not exist', () => {
    const property = { examples: ['example1', 'example2'] }
    expect(getPropertyExample(property)).toBe('example1')
  })

  it('returns the schema example if example and examples properties do not exist', () => {
    const property = { schema: { example: 'schemaExample' } }
    expect(getPropertyExample(property)).toBe('schemaExample')
  })

  it('returns the first example from schema examples array if example and examples properties do not exist', () => {
    const property = { schema: { examples: ['schemaExample1', 'schemaExample2'] } }
    expect(getPropertyExample(property)).toBe('schemaExample1')
  })

  it('returns the subexample property if example, examples, and schema properties do not exist', () => {
    const property = { subexample: 'subexampleValue' }
    expect(getPropertyExample(property)).toBe('subexampleValue')
  })

  it('returns the first subexample from subexamples array if example, examples, and schema properties do not exist', () => {
    const property = { subexamples: ['subexample1', 'subexample2'] }
    expect(getPropertyExample(property)).toBe('subexample1')
  })

  it('returns null if no example, examples, schema, or subexample properties exist', () => {
    const property = {}
    expect(getPropertyExample(property)).toBeNull()
  })

  it('returns an empty string if example property is an empty string', () => {
    const property = { example: '' }
    expect(getPropertyExample(property)).toBe('')
  })

  it('returns an empty string if schema.example property is an empty string', () => {
    const property = { schema: { example: '' } }
    expect(getPropertyExample(property)).toBe('')
  })

  it('returns an empty string for subexample property if it is an empty string', () => {
    const property = { subexample: '' }
    expect(getPropertyExample(property)).toBe('')
  })

  it('returns first value from named examples', () => {
    const property = {
      examples: {
        name_1: { value: 'parameter_value_1' },
        name_2: { value: 'parameter_value_2' },
      },
      schema: {
        type: 'string',
        examples: ['schema_value_1', 'schema_value_2'],
      },
    }
    expect(getPropertyExample(property)).toBe('parameter_value_1')
  })

  it('prioritizes parameter.examples over schema.examples', () => {
    const property = {
      examples: {
        name_1: { value: 'parameter_value_1' },
        name_2: { value: 'parameter_value_2' },
      },
      schema: {
        examples: {
          name_3: { value: 'schema_value_3' },
          name_4: { value: 'schema_value_4' },
        },
      },
    }
    expect(getPropertyExample(property)).toBe('parameter_value_1')
  })

  it('returns first .value from ExampleObject entries in schema.examples array', () => {
    const property = { schema: { examples: [{ value: 'schema_obj_value_1', summary: 'a' }, { value: 'schema_obj_value_2' }] } }
    expect(getPropertyExample(property)).toBe('schema_obj_value_1')
  })

  it('returns first entry value from named schema.examples map with ExampleObject', () => {
    const property = { schema: { examples: { ex1: { value: 'schema_named_value_1' }, ex2: { value: 'schema_named_value_2' } } } }
    expect(getPropertyExample(property)).toBe('schema_named_value_1')
  })

  it('returns first entry from named schema.examples map with raw values', () => {
    const property = { schema: { examples: { ex1: 'raw_1', ex2: 'raw_2' } } }
    expect(getPropertyExample(property)).toBe('raw_1')
  })

  it('does not skip falsy values in schema.examples array (0)', () => {
    const property = { schema: { examples: [0, 1] } }
    expect(getPropertyExample(property)).toBe(0)
  })

  it('does not skip falsy values in schema.examples array (empty string)', () => {
    const property = { schema: { examples: ['', 'x'] } }
    expect(getPropertyExample(property)).toBe('')
  })

  it('does not skip falsy values in named schema.examples map', () => {
    const property = { schema: { examples: { a: 0, b: 1 } } }
    expect(getPropertyExample(property)).toBe(0)
  })
})
