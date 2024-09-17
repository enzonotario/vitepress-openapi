export const spec = {
  openapi: '3.1.0',
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
