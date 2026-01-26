import type { LanguageConfig } from '../../../src/composables/useTheme'
import { describe, expect, it } from 'vitest'
import { availableLanguages } from '../../../src/composables/useTheme'
import { buildRequest } from '../../../src/lib/codeSamples/buildRequest'
import { generateCodeSample } from '../../../src/lib/codeSamples/generateCodeSample'

const langConfigs = Object.fromEntries(availableLanguages.map(l => [l.lang, l]))

describe('javascript', () => {
  it('generates code sample for GET request without query, headers, or body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource')`)
  })

  it('generates code sample for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: 'value'
  })
})`)
  })

  it('generates code sample for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: {
      nested: 'value',
      nestedArray: [1,     2,     {
        deep: 'value'
      }]
    }
  })
})`)
  })

  it('generates code sample with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {
  headers: {
    Authorization: 'Bearer token'
  }
})`)
  })

  it('generates code sample with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'query',
      },
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query')`)
  })

  it('generates code sample with all parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' },
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'query',
      },
    })
    const result = await generateCodeSample(langConfigs.javascript, request)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: 'value'
  })
})`)
  })
})

describe('curl', () => {
  it('generates curl command for GET request', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl https://api.example.com/resource`)
  })

  it('generates curl command for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl https://api.example.com/resource \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --data '{
  "key": "value"
}'`)
  })

  it('generates curl command for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl https://api.example.com/resource \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --data '{
  "key": {
    "nested": "value",
    "nestedArray": [
      1,
      2,
      {
        "deep": "value"
      }
    ]
  }
}'`)
  })

  it('generates curl command with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl https://api.example.com/resource \\
  --header 'Authorization: Bearer token'`)
  })

  it('generates curl command with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl 'https://api.example.com/resource?search=query'`)
  })

  it('generates curl command with all parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' },
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl 'https://api.example.com/resource?search=query' \\
  --request PUT \\
  --header 'Content-Type: application/json' \\
  --data '{
  "key": "value"
}'`)
  })

  it('handles query parameters and headers correctly', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/path/testOperation',
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' },
      parameters: [{ name: 'search', in: 'query' }, { name: 'page', in: 'query' }],
      variables: { search: 'query', page: '2' },
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl 'https://api.example.com/path/testOperation?search=query&page=2' \\
  --header 'Authorization: Bearer token' \\
  --header 'Content-Type: application/json'`)
  })

  it('displays encoded URLs correctly', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/users/{userId}/posts',
      method: 'GET',
    })
    const result = await generateCodeSample(langConfigs.curl, request)
    expect(result).toBe(`curl 'https://api.example.com/users/{userId}/posts'`)
  })
})

describe('php', () => {
  it('generates PHP code for GET request', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource");

curl_exec($ch);

curl_close($ch);`)
  })

  it('generates PHP code for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource");

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'key' => 'value'
]));

curl_exec($ch);

curl_close($ch);`)
  })

  it('generates PHP code for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource");

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'key' => [
    'nested' => 'value',
    'nestedArray' => [
      1,
      2,
      [
        'deep' => 'value'
      ]
    ]
  ]
]));

curl_exec($ch);

curl_close($ch);`)
  })

  it('generates PHP code with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource");

curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer token']);

curl_exec($ch);

curl_close($ch);`)
  })

  it('generates PHP code with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource?search=query");

curl_exec($ch);

curl_close($ch);`)
  })

  it('generates PHP code with all parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' },
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.php, request)
    expect(result).toBe(`$ch = curl_init("https://api.example.com/resource?search=query");

curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'key' => 'value'
]));

curl_exec($ch);

curl_close($ch);`)
  })
})

describe('python', () => {
  it('generates Python code for GET request', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.get("https://api.example.com/resource")`)
  })

  it('generates Python code for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.post("https://api.example.com/resource",
    headers={
      "Content-Type": "application/json"
    },
    json={
      "key": "value"
    }
)`)
  })

  it('generates Python code for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.post("https://api.example.com/resource",
    headers={
      "Content-Type": "application/json"
    },
    json={
      "key": {
        "nested": "value",
        "nestedArray": [
          1,
          2,
          {
            "deep": "value"
          }
        ]
      }
    }
)`)
  })

  it('generates Python code with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.get("https://api.example.com/resource",
    headers={
      "Authorization": "Bearer token"
    }
)`)
  })

  it('generates Python code with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.get("https://api.example.com/resource",
    params={
      "search": "query"
    }
)`)
  })

  it('generates Python code with all parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' },
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample(langConfigs.python, request)
    expect(result).toBe(`requests.put("https://api.example.com/resource",
    headers={
      "Content-Type": "application/json"
    },
    params={
      "search": "query"
    },
    json={
      "key": "value"
    }
)`)
  })
})

describe('custom languages', () => {
  it('uses custom language config with target and client', async () => {
    const nodeConfig: LanguageConfig = { lang: 'node', label: 'Node.js', highlighter: 'javascript', target: 'node', client: 'undici' }

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(nodeConfig, request)
    expect(result).toContain('undici')
  })

  it('generates code for POST request with custom language', async () => {
    const nodeConfig: LanguageConfig = { lang: 'node', label: 'Node.js', highlighter: 'javascript', target: 'node', client: 'undici' }

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample(nodeConfig, request)
    expect(result).toContain('undici')
  })

  it('allows overriding default language client', async () => {
    const axiosConfig: LanguageConfig = { lang: 'javascript', label: 'JavaScript', highlighter: 'javascript', target: 'js', client: 'axios' }

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(axiosConfig, request)
    expect(result).toContain('axios')
  })

  it('returns empty string for language missing target/client', async () => {
    const customConfig: LanguageConfig = { lang: 'custom', label: 'Custom', highlighter: 'plaintext' }

    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample(customConfig, request)
    expect(result).toBe('')
  })
})

describe('update request', () => {
  it('updates request with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      headers: { 'Content-Type': 'application/json-wrong' },
      body: { key: 'value-wrong' },
      parameters: [
        { name: 'searcha', in: 'query' },
      ],
      variables: {
        searcha: 'query',
      },
    })

    const fixedRequest = buildRequest({
      ...request,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' },
      parameters: [
        { name: 'search', in: 'query' },
      ],
      variables: {
        search: 'query',
      },
      contentType: 'application/json',
    },
    )

    const result = await generateCodeSample(langConfigs.javascript, fixedRequest)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: 'value'
  })
})`)
  })
})
