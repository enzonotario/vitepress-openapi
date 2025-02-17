import { describe, expect, it } from 'vitest'
import { generateCodeSample } from '../../src/lib/codeSamples/generateCodeSample'
import { OARequest } from '../../src/lib/codeSamples/request'

describe('generateCodeSampleJavaScript', async () => {
  it('generates code sample for GET request without query, headers, or body', async () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = await generateCodeSample('javascript', request)
    expect(result).toBe(`fetch('https://api.example.com/resource')`)
  })

  it('generates code sample for POST request with body', async () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
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
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
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
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = await generateCodeSample('javascript', request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {
  headers: {
    Authorization: 'Bearer token'
  }
})`)
  })

  it('generates code sample with query parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = await generateCodeSample('javascript', request)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query')`)
  })

  it('generates code sample with all parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
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

describe('generateCodeSampleCurl', async () => {
  it('generates curl command for GET request', async () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl https://api.example.com/resource`)
  })

  it('generates curl command for POST request with body', async () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl https://api.example.com/resource \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --data '{
  "key": "value"
}'`)
  })

  it('generates curl command for POST request with deep body', async () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
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
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl https://api.example.com/resource \\
  --header 'Authorization: Bearer token'`)
  })

  it('generates curl command with query parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl 'https://api.example.com/resource?search=query'`)
  })

  it('generates curl command with all parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
    const result = await generateCodeSample('curl', request)
    expect(result).toBe(`curl 'https://api.example.com/resource?search=query' \\
  --request PUT \\
  --header 'Content-Type: application/json' \\
  --data '{
  "key": "value"
}'`)
  })

  it('handles query parameters and headers correctly', async () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' }
    const queryParams: Record<string, string> = { search: 'query', page: '2' }
    const result = await generateCodeSample('curl', { url, method, headers, query: queryParams })
    expect(result).toBe(`curl 'https://api.example.com/path/testOperation?search=query&page=2' \\
  --header 'Authorization: Bearer token' \\
  --header 'Content-Type: application/json'`)
  })
})

describe('generateCodeSamplePhp', async () => {
  it('generates PHP code for GET request', async () => {
    const request = new OARequest('https://api.example.com/resource')
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
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
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
  CURLOPT_POSTFIELDS => "{\\"key\\":\\"value\\"}",
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
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
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
  CURLOPT_POSTFIELDS => "{\\"key\\":{\\"nested\\":\\"value\\",\\"nestedArray\\":[1,2,{\\"deep\\":\\"value\\"}]}}",
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
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
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
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
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
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
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
  CURLOPT_POSTFIELDS => "{\\"key\\":\\"value\\"}",
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

describe('generateCodeSamplePython', async () => {
  it('generates Python code for GET request', async () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

conn.request("GET", "/resource")

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })

  it('generates Python code for POST request with body', async () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

payload = "{\\"key\\":\\"value\\"}"

headers = { 'Content-Type': "application/json" }

conn.request("POST", "/resource", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })

  it('generates Python code for POST request with deep body', async () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

payload = "{\\"key\\":{\\"nested\\":\\"value\\",\\"nestedArray\\":[1,2,{\\"deep\\":\\"value\\"}]}}"

headers = { 'Content-Type': "application/json" }

conn.request("POST", "/resource", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })

  it('generates Python code with headers', async () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

headers = { 'Authorization': "Bearer token" }

conn.request("GET", "/resource", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })

  it('generates Python code with query parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

conn.request("GET", "/resource")

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })

  it('generates Python code with all parameters', async () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
    const result = await generateCodeSample('python', request)
    expect(result).toBe(`import http.client

conn = http.client.HTTPSConnection("api.example.com")

payload = "{\\"key\\":\\"value\\"}"

headers = { 'Content-Type': "application/json" }

conn.request("PUT", "/resource", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))`)
  })
})
