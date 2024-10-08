export const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  externalDocs: {
    description: 'Find out more about OpenAPI',
    url: 'https://swagger.io/specification/',
  },
  paths: {
    '/users': {
      get: {
        'operationId': 'getUsers',
        'parameters': [
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
            },
          },
        ],
        'x-codeSamples': [
          {
            lang: 'JavaScript',
            source: 'fetch("/users")',
          },
        ],
        'security': [
          {
            apiKey: [],
          },
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/users/{id}': {
      get: {
        operationId: 'getUser',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    '/users/{id}/pets': {
      get: {
        operationId: 'getUserPets',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
      },
    },
  },
  servers: [
    {
      url: 'https://api.example.com',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
}

export const specWithCircularRef = {
  openapi: '3.0.0',
  info: {
    title: 'Minimal API with Circular Reference',
    version: '1.0.0',
  },
  paths: {
    '/parent': {
      get: {
        summary: 'Get a parent',
        operationId: 'getParent',
        responses: {
          200: {
            description: 'A parent with a child',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Parent',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Parent: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          child: {
            $ref: '#/components/schemas/Child',
          },
        },
      },
      Child: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          parent: {
            $ref: '#/components/schemas/Parent',
          },
        },
      },
    },
  },
}

export const specWithCircularRefAndExample = {
  openapi: '3.0.0',
  info: {
    title: 'Minimal API with Circular Reference and Example',
    version: '1.0.0',
  },
  paths: {
    '/parent': {
      get: {
        summary: 'Get a parent',
        operationId: 'getParent',
        responses: {
          200: {
            description: 'A parent with a child',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Parent',
                },
                example: {
                  id: '1',
                  child: {
                    id: '2',
                    parent: {
                      id: '1',
                      child: {
                        id: '2',
                        parent: '[Circular Reference]',
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
  components: {
    schemas: {
      Parent: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          child: {
            $ref: '#/components/schemas/Child',
          },
        },
      },
      Child: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          parent: {
            $ref: '#/components/schemas/Parent',
          },
        },
      },
    },
  },
}

export const specWithMultipleLevels = {
  openapi: '3.0.0',
  info: {
    title: 'Deep Nested API without Circular Reference',
    version: '1.0.0',
  },
  paths: {
    '/root': {
      get: {
        summary: 'Get the root object',
        operationId: 'getRoot',
        responses: {
          200: {
            description: 'A deeply nested structure',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Level1',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Level1: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level2: {
            $ref: '#/components/schemas/Level2',
          },
        },
      },
      Level2: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level3: {
            $ref: '#/components/schemas/Level3',
          },
        },
      },
      Level3: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level4: {
            $ref: '#/components/schemas/Level4',
          },
        },
      },
      Level4: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level5: {
            $ref: '#/components/schemas/Level5',
          },
        },
      },
      Level5: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level6: {
            $ref: '#/components/schemas/Level6',
          },
        },
      },
      Level6: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level7: {
            $ref: '#/components/schemas/Level7',
          },
        },
      },
      Level7: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level8: {
            $ref: '#/components/schemas/Level8',
          },
        },
      },
      Level8: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level9: {
            $ref: '#/components/schemas/Level9',
          },
        },
      },
      Level9: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level10: {
            $ref: '#/components/schemas/Level10',
          },
        },
      },
      Level10: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level11: {
            $ref: '#/components/schemas/Level11',
          },
        },
      },
      Level11: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level12: {
            $ref: '#/components/schemas/Level12',
          },
        },
      },
      Level12: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level13: {
            $ref: '#/components/schemas/Level13',
          },
        },
      },
      Level13: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level14: {
            $ref: '#/components/schemas/Level14',
          },
        },
      },
      Level14: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level15: {
            $ref: '#/components/schemas/Level15',
          },
        },
      },
      Level15: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level16: {
            $ref: '#/components/schemas/Level16',
          },
        },
      },
      Level16: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level17: {
            $ref: '#/components/schemas/Level17',
          },
        },
      },
      Level17: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level18: {
            $ref: '#/components/schemas/Level18',
          },
        },
      },
      Level18: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level19: {
            $ref: '#/components/schemas/Level19',
          },
        },
      },
      Level19: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          level20: {
            $ref: '#/components/schemas/Level20',
          },
        },
      },
      Level20: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          finalValue: {
            type: 'string',
          },
        },
      },
    },
  },
}

export const specWithSchemaAndContentTypes = {
  openapi: '3.0.0',
  info: {
    title: 'API with Schema and Content Types',
    version: '1.0.0',
  },
  paths: {
    '/pets': {
      get: {
        summary: 'Get a list of pets',
        operationId: 'getPets',
        responses: {
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'RFC 7807 (https://datatracker.ietf.org/doc/html/rfc7807)',
                  properties: {
                    type: {
                      type: 'string',
                      examples: [
                        'https://example.com/errors/generic-error',
                      ],
                    },
                    title: {
                      type: 'string',
                      examples: [
                        'Something went wrong here.',
                      ],
                    },
                    status: {
                      type: 'integer',
                      format: 'int64',
                      examples: [
                        403,
                      ],
                    },
                    detail: {
                      type: 'string',
                      examples: [
                        'Unfortunately, we can’t provide further information.',
                      ],
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
}
