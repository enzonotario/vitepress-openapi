import { describe, expect, it } from 'vitest'
import { buildRequest } from '../../../src/lib/codeSamples/buildRequest'
import { generateCodeSample } from '../../../src/lib/codeSamples/generateCodeSample'

describe('javascript', () => {
  it('generates code sample for GET request without query, headers, or body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
    })
    const result = await generateCodeSample('javascript', request)
    expect(result).toBe(`fetch('https://api.example.com/resource')`)
  })

  it('generates code sample for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample('javascript', request)
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
    const result = await generateCodeSample('javascript', request)
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
    const result = await generateCodeSample('javascript', request)
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
    const result = await generateCodeSample('javascript', request)
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
    const result = await generateCodeSample('javascript', request)
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
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl https://api.example.com/resource`)
  })

  it('generates curl command for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample('curl', request)
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
    const result = await generateCodeSample('curl', request)
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
    const result = await generateCodeSample('curl', request)
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
    const result = await generateCodeSample('curl', request)
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
    const result = await generateCodeSample('curl', request)
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
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl 'https://api.example.com/path/testOperation?search=query&page=2' \\
  --header 'Authorization: Bearer token' \\
  --header 'Content-Type: application/json'`)
  })
})

describe('php', () => {
  it('generates PHP code for GET request', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
  })

  it('generates PHP code for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    'key' => 'value'
  ]),
  CURLOPT_HTTPHEADER => [
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
  })

  it('generates PHP code for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
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
  ]),
  CURLOPT_HTTPHEADER => [
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
  })

  it('generates PHP code with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer token"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
  })

  it('generates PHP code with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
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
    const result = await generateCodeSample('php', request)
    expect(result).toBe(`<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/resource",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "PUT",
  CURLOPT_POSTFIELDS => json_encode([
    'key' => 'value'
  ]),
  CURLOPT_HTTPHEADER => [
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`)
  })
})

describe('python', () => {
  it('generates Python code for GET request', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
    })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

response = requests.get(url)

print(response.json())`)
  })

  it('generates Python code for POST request with body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: 'value' },
    })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

payload = { "key": "value" }
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.json())`)
  })

  it('generates Python code for POST request with deep body', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'POST',
      body: { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } },
    })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

payload = { "key": {
        "nested": "value",
        "nestedArray": [1, 2, { "deep": "value" }]
    } }
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.json())`)
  })

  it('generates Python code with headers', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
    })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

headers = {"Authorization": "Bearer token"}

response = requests.get(url, headers=headers)

print(response.json())`)
  })

  it('generates Python code with query parameters', async () => {
    const request = buildRequest({
      baseUrl: 'https://api.example.com',
      path: '/resource',
      method: 'GET',
      parameters: [{ name: 'search', in: 'query' }],
      variables: { search: 'query' },
    })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

response = requests.get(url)

print(response.json())`)
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
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import requests

url = "https://api.example.com/resource"

payload = { "key": "value" }
headers = {"Content-Type": "application/json"}

response = requests.put(url, json=payload, headers=headers)

print(response.json())`)
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
    },
    )

    const result = await generateCodeSample('javascript', fixedRequest)
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
