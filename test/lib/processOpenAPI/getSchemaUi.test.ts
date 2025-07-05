import { dereferenceSync } from '@trojs/openapi-dereference'
import { describe, expect, it } from 'vitest'
import { getSchemaExample } from '../../../src/lib/examples/getSchemaExample'
import { getSchemaUi } from '../../../src/lib/parser/getSchemaUi'
import { specWithCircularRef } from '../../testsConstants'

interface FixtureTest {
  jsonSchema: any
  schemaUi: any
  schemaUiJson: any
  useExample?: boolean
  contentType?: string
}

const fixtures: Record<string, FixtureTest> = {
  'object with required and optional properties': {
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

  'array of objects': {
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

  'schema with circular reference': {
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

  'schema with additionalProperties': {
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

  'empty schema returns empty array': {
    jsonSchema: {},
    schemaUi: [],
    schemaUiJson: [],
  },

  'schema with enum': {
    jsonSchema: {
      type: 'string',
      enum: ['foo', 'bar'],
      description: 'enum description',
    },
    schemaUi: {
      name: '',
      types: ['string'],
      required: false,
      enum: ['foo', 'bar'],
      description: 'enum description',
    },
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

  'anyOf schema': {
    jsonSchema: {
      anyOf: [
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
            isAnyOfItem: true,
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
            isAnyOfItem: true,
          },
        },
      ],
      required: false,
      meta: {
        isAnyOf: true,
      },
    },
    // Takes first anyOf schema as default.
    schemaUiJson: {
      name: 'string',
      age: 0,
    },
  },

  'anyOf schema with description': {
    jsonSchema: {
      type: 'object',
      properties: {
        foo: {
          anyOf: [
            {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            {
              type: 'null',
            },
          ],
          description: 'Some description here...',
        },
      },
      required: ['foo'],
    },
    schemaUi: {
      name: '',
      types: ['object'],
      required: false,
      properties: [
        {
          name: 'foo',
          types: ['array', 'null'],
          required: true,
          description: 'Some description here...',
          properties: [
            {
              name: '',
              types: ['array'],
              required: false,
              subtype: 'string',
              meta: {
                isAnyOfItem: true,
              },
            },
            {
              name: '',
              types: ['null'],
              required: false,
              meta: {
                isAnyOfItem: true,
              },
            },
          ],
          meta: {
            isAnyOf: true,
          },
        },
      ],
    },
    schemaUiJson: {
      foo: ['string'],
    },
  },

  'required oneOf property': {
    jsonSchema: {
      type: 'object',
      properties: {
        foo: {
          oneOf: [
            { type: 'string' },
            { type: 'null' },
          ],
        },
      },
      required: ['foo'],
    },
    schemaUi: {
      name: '',
      types: ['object'],
      required: false,
      properties: [
        {
          name: 'foo',
          types: ['string', 'null'],
          required: true,
          properties: [
            { name: '', types: ['string'], required: false, meta: { isOneOfItem: true } },
            { name: '', types: ['null'], required: false, meta: { isOneOfItem: true } },
          ],
          meta: { isOneOf: true },
        },
      ],
    },
    schemaUiJson: {
      foo: 'string',
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

  'array with items oneOf': {
    jsonSchema: {
      type: 'array',
      items: {
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
    schemaUi: {
      name: '',
      types: ['array'],
      required: false,
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
      meta: {
        isOneOf: true,
      },
    },
    // Takes first oneOf schema as default.
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

  'constants without example': {
    jsonSchema: {
      const: 'foo',
    },
    schemaUi: {
      name: '',
      types: ['string'],
      required: false,
      meta: {
        isConstant: true,
      },
      examples: ['foo'],
    },
    schemaUiJson: 'foo',
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

  'array of oneOf': {
    jsonSchema: {
      properties: {
        executions: {
          items: {
            oneOf: [
              {
                properties: {
                  account: {
                    pattern: '^0x[a-f0-9]+$',
                    type: 'string',
                  },
                  broadcasted: {
                    type: 'boolean',
                  },
                  chainId: {
                    pattern: '^0x[a-f0-9]+$',
                    type: 'string',
                  },
                  checkinTime: {
                    type: 'number',
                  },
                  expectedWorstCaseGasPrice: {
                    type: 'string',
                  },
                  finalized: {
                    type: 'boolean',
                  },
                  onBehalf: {
                    pattern: '^0x[a-f0-9]+$',
                    type: 'string',
                  },
                  payload: {
                    type: 'string',
                  },
                  paymentReserve: {
                    type: 'string',
                  },
                },
                required: [
                  'type',
                  'chainId',
                  'slot',
                  'payload',
                ],
                type: 'object',
              },
              {
                properties: {
                  account: {
                    pattern: '^0x[a-f0-9]+$',
                    type: 'string',
                  },
                  broadcasted: {
                    type: 'boolean',
                  },
                  chainId: {
                    pattern: '^0x[a-f0-9]+$',
                    type: 'string',
                  },
                  checkinTime: {
                    type: 'number',
                  },
                },
                required: [
                  'type',
                  'chainId',
                  'slot',
                  'executions',
                ],
                type: 'object',
              },
            ],
          },
          type: 'array',
        },
        success: {
          const: true,
        },
      },
      required: [
        'success',
        'executions',
      ],
      type: 'object',
    },
    schemaUi: {
      name: '',
      properties: [
        {
          name: 'executions',
          properties: [
            {
              name: '',
              properties: [
                { name: 'account', constraints: { pattern: '^0x[a-f0-9]+$' }, required: false, types: ['string'] },
                { name: 'broadcasted', required: false, types: ['boolean'] },
                { name: 'chainId', constraints: { pattern: '^0x[a-f0-9]+$' }, required: true, types: ['string'] },
                { name: 'checkinTime', required: false, types: ['number'] },
                { name: 'expectedWorstCaseGasPrice', required: false, types: ['string'] },
                { name: 'finalized', required: false, types: ['boolean'] },
                { name: 'onBehalf', constraints: { pattern: '^0x[a-f0-9]+$' }, required: false, types: ['string'] },
                { name: 'payload', required: true, types: ['string'] },
                { name: 'paymentReserve', required: false, types: ['string'] },
              ],
              required: false,
              types: ['object'],
              meta: { isOneOfItem: true },
            },
            {
              name: '',
              properties: [
                { name: 'account', constraints: { pattern: '^0x[a-f0-9]+$' }, required: false, types: ['string'] },
                { name: 'broadcasted', required: false, types: ['boolean'] },
                { name: 'chainId', constraints: { pattern: '^0x[a-f0-9]+$' }, required: true, types: ['string'] },
                { name: 'checkinTime', required: false, types: ['number'] },
              ],
              required: false,
              types: ['object'],
              meta: { isOneOfItem: true },
            },
          ],
          required: true,
          types: ['array'],
          meta: { isOneOf: true },
        },
        {
          name: 'success',
          required: false,
          types: ['string'],
          meta: { isConstant: true },
          examples: [true],
        },
      ],
      required: false,
      types: ['object'],
    },
    schemaUiJson: {
      executions: [
        {
          account: 'string',
          broadcasted: true,
          chainId: 'string',
          checkinTime: 0,
          expectedWorstCaseGasPrice: 'string',
          finalized: true,
          onBehalf: 'string',
          payload: 'string',
          paymentReserve: 'string',
        },
      ],
      success: true,
    },
  },

  'property without type': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: {},
      },
    },
    schemaUi: {
      name: '',
      properties: [
        { name: 'name', required: false, types: [] },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      name: null,
    },
  },

  'xml schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', xml: { name: 'name' } },
        age: { type: 'integer', xml: { name: 'age' } },
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
    schemaUiJson: `<?xml version="1.0"?>
<name>string</name>
<age>0</age>
`,
    contentType: 'application/xml',
  },

  'array of items without type': {
    jsonSchema: {
      properties: {
        objects: {
          type: 'array',
          items: {
            properties: {
              id: {},
              name: {},
            },
          },
        },
        constStrings: {
          type: 'array',
          items: {
            const: 'foo',
          },
        },
        constNumbers: {
          type: 'array',
          items: {
            const: 42,
          },
        },
        constBooleans: {
          type: 'array',
          items: {
            const: true,
          },
        },
        constNulls: {
          type: 'array',
          items: {
            const: null,
          },
        },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        {
          name: 'objects',
          required: false,
          types: ['array'],
          properties: [
            { name: 'id', required: false, types: [] },
            { name: 'name', required: false, types: [] },
          ],
          subtype: 'object',
        },
        {
          name: 'constStrings',
          required: false,
          types: ['array'],
          properties: undefined,
          subtype: 'string',
          meta: { isConstant: true },
        },
        {
          name: 'constNumbers',
          required: false,
          types: ['array'],
          properties: undefined,
          subtype: 'number',
          meta: { isConstant: true },
        },
        {
          name: 'constBooleans',
          required: false,
          types: ['array'],
          properties: undefined,
          subtype: 'boolean',
          meta: { isConstant: true },
        },
        {
          name: 'constNulls',
          required: false,
          types: ['array'],
          properties: undefined,
          subtype: 'null',
          meta: { isConstant: true },
        },
      ],
      required: false,
      types: ['object'],
    },
    schemaUiJson: {
      objects: [
        {
          id: null,
          name: null,
        },
      ],
      constStrings: ['string'],
      constNumbers: [0],
      constBooleans: [true],
      constNulls: [null],
    },
  },

  'object with default value': {
    jsonSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', default: 'John' },
        age: { type: 'integer', default: 42 },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        {
          constraints: { default: 'John' },
          name: 'name',
          required: false,
          types: ['string'],
          defaultValue: 'John',
        },
        {
          constraints: { default: 42 },
          name: 'age',
          required: false,
          types: ['integer'],
          defaultValue: 42,
        },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      name: 'John',
      age: 42,
    },
  },

  'object nullable': {
    jsonSchema: {
      type: ['object', 'null'],
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
      types: ['object', 'null'],
      required: false,
    },
    schemaUiJson: {
      name: 'string',
      age: 0,
    },
  },

  'array with prefixItems': {
    jsonSchema: {
      type: 'array',
      prefixItems: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
      ],
    },
    schemaUi: {
      name: '',
      types: ['array'],
      required: false,
      properties: [
        {
          name: '[0]',
          types: ['string'],
          required: false,
          meta: {
            isPrefixItem: true,
            prefixItemIndex: 0,
          },
        },
        {
          name: '[1]',
          types: ['number'],
          required: false,
          meta: {
            isPrefixItem: true,
            prefixItemIndex: 1,
          },
        },
        {
          name: '[2]',
          types: ['boolean'],
          required: false,
          meta: {
            isPrefixItem: true,
            prefixItemIndex: 2,
          },
        },
      ],
      meta: {
        hasPrefixItems: true,
      },
    },
    schemaUiJson: [
      'string',
      0,
      true,
    ],
  },

  'array with prefixItems and items': {
    jsonSchema: {
      type: 'array',
      prefixItems: [
        { type: 'string' },
        { type: 'number' },
      ],
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
        },
      },
    },
    schemaUi: {
      name: '',
      types: ['array'],
      required: false,
      properties: [
        {
          name: '[0]',
          types: ['string'],
          required: false,
          meta: {
            isPrefixItem: true,
            prefixItemIndex: 0,
          },
        },
        {
          name: '[1]',
          types: ['number'],
          required: false,
          meta: {
            isPrefixItem: true,
            prefixItemIndex: 1,
          },
        },
        {
          name: '[n+]',
          types: ['object'],
          required: false,
          properties: [
            { name: 'name', types: ['string'], required: false },
            { name: 'age', types: ['integer'], required: false },
          ],
          meta: {
            isAdditionalItems: true,
          },
        },
      ],
      meta: {
        hasPrefixItems: true,
      },
    },
    schemaUiJson: [
      'string',
      0,
      {
        name: 'string',
        age: 0,
      },
    ],
  },

  'file upload schema': {
    jsonSchema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    schemaUi: {
      name: '',
      properties: [
        {
          name: 'file',
          required: false,
          types: ['string'],
          constraints: { format: 'binary' },
        },
      ],
      types: ['object'],
      required: false,
    },
    schemaUiJson: {
      file: '',
    },
  },
}

describe('getSchemaUi and getSchemaUiJson from fixtures', () => {
  Object.entries(fixtures).forEach(([name, { jsonSchema, schemaUi, schemaUiJson, useExample, contentType }]) => {
    it(`parses ${name} schema`, () => {
      const parsedSchemaUi = getSchemaUi(jsonSchema)
      expect(parsedSchemaUi).toEqual(schemaUi)

      const schemaExample = getSchemaExample(
        contentType ?? 'application/json',
        parsedSchemaUi,
        useExample,
      )
      expect(schemaExample[Object.keys(schemaExample)[0]].value).toEqual(schemaUiJson)
    })
  })
})
