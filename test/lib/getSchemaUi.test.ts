import { describe, expect, it } from 'vitest'
import { dereferenceSync } from '@trojs/openapi-dereference'
import { getSchemaUi } from '../../src/lib/getSchemaUi'
import { getSchemaUiJson } from '../../src/lib/getSchemaUiJson'
import { specWithCircularRef } from '../testsConstants'

const fixtures = {
  'simple object': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name'],
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'name', required: true, types: ['string'] },
        { name: 'age', required: false, types: ['integer'] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      name: 'string',
      age: 0,
    },
  },

  'simple array': {
    jsonSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user: { type: 'string' },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['array'],
      required: false,
      subtype: 'object',
      properties: [{ name: 'user', types: ['string'], required: false }],
    },
    schemaUiJson: [{ user: 'string' }],
  },

  'string schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        self: { $ref: '#/definitions/self' },
      },
      definitions: {
        self: { type: 'object', circularReference: 'self' },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'self', required: false, types: ['string'] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      self: 'string',
    },
  },

  'additional properties': {
    jsonSchema: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
    schemaUi: {
      name: '',
      properties: [
        {
          meta: {
            isAdditionalProperties: true,
          },
          name: 'additionalProperties',
          required: false,
          types: ['string'],
        },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      additionalProperties: 'string',
    },
  },

  'empty schema': {
    jsonSchema: {},
    schemaUi: [],
    schemaUiJson: [],
  },

  'literal values': {
    jsonSchema: {
      type: 'string',
      enum: ['foo', 'bar'],
    },
    schemaUi: { name: '', types: ['string'], required: false, enum: ['foo', 'bar'] },
    schemaUiJson: 'string',
  },

  'deep array schema': {
    jsonSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
          addresses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                street: { type: 'string' },
              },
            },
          },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['array'],
      required: false,
      subtype: 'object',
      properties: [
        { name: 'name', types: ['string'], required: false },
        { name: 'age', types: ['integer'], required: false },
        {
          name: 'addresses',
          types: ['array'],
          required: false,
          subtype: 'object',
          properties: [
            { name: 'street', types: ['string'], required: false },
          ],
        },
      ],
    },
    schemaUiJson: [
      {
        name: 'string',
        age: 0,
        addresses: [
          {
            street: 'string',
          },
        ],
      },
    ],
  },

  'deep circular reference schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        parent: {
          type: 'object',
          properties: {
            child: {
              type: 'object',
              properties: {
                parent: {
                  type: 'object',
                  properties: {
                    child: {
                      type: 'object',
                      properties: {
                        parent: {
                          type: 'object',
                          properties: {
                            child: {
                              type: 'object',
                              properties: {
                                final: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        {
          name: 'parent',
          required: false,
          types: ['object'],
          properties: [
            {
              name: 'child',
              required: false,
              types: ['object'],
              properties: [
                {
                  name: 'parent',
                  required: false,
                  types: ['object'],
                  properties: [
                    {
                      name: 'child',
                      required: false,
                      types: ['object'],
                      properties: [
                        {
                          name: 'parent',
                          required: false,
                          types: ['object'],
                          properties: [
                            {
                              name: 'child',
                              required: false,
                              types: ['object'],
                              properties: [
                                {
                                  name: 'final',
                                  required: false,
                                  types: ['string'],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      parent: {
        child: {
          parent: {
            child: {
              parent: {
                child: {
                  final: 'string',
                },
              },
            },
          },
        },
      },
    },
  },

  'oneOf schema': {
    jsonSchema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name'],
        },
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
            addresses: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  street: { type: 'string' },
                },
              },
            },
          },
          required: ['name'],
        },
      ],
    },
    schemaUi: {
      name: '',
      types: ['object'],
      properties: [
        {
          name: '',
          properties: [
            { name: 'name', types: ['string'], required: true },
            { name: 'age', types: ['integer'], required: false },
          ],
          types: ['object'],
          required: false,
          meta: {
            isOneOfItem: true,
          },
        },
        {
          name: '',
          properties: [
            { name: 'name', types: ['string'], required: true },
            { name: 'age', types: ['integer'], required: false },
            {
              name: 'addresses',
              properties: [
                { name: 'street', types: ['string'], required: false },
              ],
              required: false,
              types: ['array'],
              subtype: 'object',
            },
          ],
          types: ['object'],
          required: false,
          meta: {
            isOneOfItem: true,
          },
        },
      ],
      required: false,
      meta: {
        isOneOf: true,
      },
    },
    // Takes first oneOf schema as default.
    schemaUiJson: {
      name: 'string',
      age: 0,
    },
  },

  'nested oneOf schema': {
    jsonSchema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            user: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    age: { type: 'integer' },
                    addresses: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          street: { type: 'string' },
                        },
                      },
                    },
                  },
                  required: ['name'],
                },
                {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    age: { type: 'integer' },
                  },
                  required: ['name'],
                },
              ],
            },
          },
        },
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name'],
        },
      ],
    },
    schemaUi: {
      name: '',
      types: ['object'],
      properties: [
        {
          name: '',
          properties: [
            {
              types: ['object'],
              name: 'user',
              properties: [
                {
                  name: '',
                  properties: [
                    {
                      name: 'name',
                      types: ['string'],
                      required: true,
                    },
                    {
                      name: 'age',
                      types: ['integer'],
                      required: false,
                    },
                    {
                      name: 'addresses',
                      properties: [
                        { name: 'street', types: ['string'], required: false },
                      ],
                      required: false,
                      types: ['array'],
                      subtype: 'object',
                    },
                  ],
                  required: false,
                  types: ['object'],
                  meta: {
                    isOneOfItem: true,
                  },
                },
                {
                  name: '',
                  properties: [
                    { name: 'name', types: ['string'], required: true },
                    { name: 'age', types: ['integer'], required: false },
                  ],
                  required: false,
                  types: ['object'],
                  meta: {
                    isOneOfItem: true,
                  },
                },
              ],
              required: false,
              meta: {
                isOneOf: true,
              },
            },
          ],
          types: ['object'],
          required: false,
          meta: {
            isOneOfItem: true,
          },
        },
        {
          name: '',
          properties: [
            { name: 'name', types: ['string'], required: true },
            { name: 'age', types: ['integer'], required: false },
          ],
          types: ['object'],
          required: false,
          meta: {
            isOneOfItem: true,
          },
        },
      ],
      required: false,
      meta: {
        isOneOf: true,
      },
    },
    // Takes first oneOf schema as default.
    schemaUiJson: {
      user: {
        name: 'string',
        age: 0,
        addresses: [
          {
            street: 'string',
          },
        ],
      },
    },
  },

  'oneOf inside object schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        user: {
          oneOf: [
            {
              type: 'object',
              properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
                addresses: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      street: { type: 'string' },
                    },
                  },
                },
              },
              required: ['name'],
            },
            {
              type: 'object',
              properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
              },
              required: ['name'],
            },
          ],
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['object'],
      properties: [
        {
          name: 'user',
          properties: [
            {
              name: '',
              properties: [
                { name: 'name', types: ['string'], required: true },
                { name: 'age', types: ['integer'], required: false },
                {
                  name: 'addresses',
                  properties: [
                    { name: 'street', types: ['string'], required: false },
                  ],
                  required: false,
                  types: ['array'],
                  subtype: 'object',
                },
              ],
              types: ['object'],
              required: false,
              meta: {
                isOneOfItem: true,
              },
            },
            {
              name: '',
              properties: [
                { name: 'name', types: ['string'], required: true },
                { name: 'age', types: ['integer'], required: false },
              ],
              types: ['object'],
              required: false,
              meta: {
                isOneOfItem: true,
              },
            },
          ],
          types: ['object'],
          required: false,
          meta: {
            isOneOf: true,
          },
        },
      ],
      required: false,
    },
    // Takes first oneOf schema as default.
    schemaUiJson: {
      user: {
        name: 'string',
        age: 0,
        addresses: [
          {
            street: 'string',
          },
        ],
      },
    },
  },

  'schema with array property': {
    jsonSchema: {
      type: 'object',
      properties: {
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
          },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['object'],
      required: false,
      properties: [
        {
          name: 'addresses',
          types: ['array'],
          required: false,
          subtype: 'object',
          properties: [
            { name: 'street', types: ['string'], required: false },
          ],
        },
      ],
    },
    schemaUiJson: {
      addresses: [
        {
          street: 'string',
        },
      ],
    },
  },

  'property with array of strings': {
    jsonSchema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['object'],
      required: false,
      properties: [
        {
          name: 'tags',
          types: ['array'],
          required: false,
          properties: undefined,
          subtype: 'string',
        },
      ],
    },
    schemaUiJson: {
      tags: ['string'],
    },
  },

  'nested object schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        parent: {
          type: 'object',
          properties: {
            child: {
              type: 'object',
              properties: {
                parent: {
                  type: 'object',
                  properties: {
                    final: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['object'],
      required: false,
      properties: [
        {
          name: 'parent',
          types: ['object'],
          required: false,
          properties: [
            {
              name: 'child',
              types: ['object'],
              required: false,
              properties: [
                {
                  name: 'parent',
                  types: ['object'],
                  required: false,
                  properties: [
                    {
                      name: 'final',
                      types: ['string'],
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    schemaUiJson: {
      parent: {
        child: {
          parent: {
            final: 'string',
          },
        },
      },
    },
  },

  'constants': {
    jsonSchema: {
      const: 'foo',
    },
    schemaUi: {
      name: '',
      types: ['string'],
      required: false,
      examples: ['foo'],
      meta: {
        isConstant: true,
      },
    },
    schemaUiJson: 'foo',
    useExample: true,
  },

  'null property': {
    jsonSchema: {
      type: 'object',
      properties: {
        nullableField: {
          type: 'null',
        },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'nullableField', required: false, types: ['null'] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      nullableField: null,
    },
  },

  'circular reference schema': {
    jsonSchema: dereferenceSync(specWithCircularRef).components.schemas.Parent,
    schemaUi: {
      name: '',
      properties: [
        { name: 'id', required: false, types: ['string'] },
        {
          name: 'child',
          required: false,
          types: ['object'],
          properties: [
            { name: 'id', required: false, types: ['string'] },
            {
              name: 'parent',
              required: false,
              description: 'Circular reference to **/root**',
              meta: {
                isCircularReference: true,
              },
              types: ['object'],
            },
          ],
        },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      id: 'string',
      child: {
        id: 'string',
        parent: '[Circular Reference]',
      },
    },
  },

  'takes first type of multiple types when getting schemaUiJson, prioritizing non-null types': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: { type: ['string', 'null'] },
        age: { type: ['number', 'null'] },
        phone: { type: ['null', 'string'] },
        phone2: { type: ['null', 'number', 'string'] },
      },
      required: ['name'],
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'name', required: true, types: ['string', 'null'] },
        { name: 'age', required: false, types: ['number', 'null'] },
        { name: 'phone', required: false, types: ['null', 'string'] },
        { name: 'phone2', required: false, types: ['null', 'number', 'string'] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      name: 'string',
      age: 0,
      phone: 'string',
      phone2: 0,
    },
  },

  'properties without example': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'name', required: false, types: ['string'] },
        { name: 'age', required: false, types: ['integer'] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      name: 'string',
      age: 0,
    },
    useExample: true,
  },
}

describe('getSchemaUi and getSchemaUiJson from fixtures', () => {
  Object.entries(fixtures).forEach(([name, { jsonSchema, schemaUi, schemaUiJson, useExample }]) => {
    it(`parses ${name} schema`, () => {
      const result = getSchemaUi(jsonSchema)
      // expect(result).toEqual(schemaUi)

      const resultJson = getSchemaUiJson(result, useExample)
      expect(resultJson).toEqual(schemaUiJson)
    })
  })
})
