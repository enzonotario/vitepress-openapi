import { describe, expect, it } from 'vitest'
import { OARequest } from 'vitepress-openapi'
import { generateCodeSampleJavaScript } from '../../src/lib/codeSamples/generateCodeSampleJavaScript'
import { generateCodeSampleCurl } from '../../src/lib/codeSamples/generateCodeSampleCurl'
import { generateCodeSamplePhp } from '../../src/lib/codeSamples/generateCodeSamplePhp'
import { generateCodeSamplePython } from '../../src/lib/codeSamples/generateCodeSamplePython'

describe('generateCodeSampleJavaScript', () => {
  it('generates code sample for GET request without query, headers, or body', () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource')
  .then(response => response.json())
  .then(data => console.log(data));`)
  })

  it('generates code sample for POST request with body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {method:'POST',body:'{"key":"value"}'})
  .then(response => response.json())
  .then(data => console.log(data));`)
  })

  it('generates code sample for POST request with deep body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {method:'POST',body:'{"key":{"nested":"value","nestedArray":[1,2,{"deep":"value"}]}}'})
  .then(response => response.json())
  .then(data => console.log(data));`)
  })

  it('generates code sample with headers', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource', {headers:{'Authorization':'Bearer token'}})
  .then(response => response.json())
  .then(data => console.log(data));`)
  })

  it('generates code sample with query parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query')
  .then(response => response.json())
  .then(data => console.log(data));`)
  })

  it('generates code sample with all parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
    const result = generateCodeSampleJavaScript(request)
    expect(result).toBe(`fetch('https://api.example.com/resource?search=query', {method:'PUT',headers:{'Content-Type':'application/json'},body:'{"key":"value"}'})
  .then(response => response.json())
  .then(data => console.log(data));`)
  })
})

describe('generateCodeSampleCurl', () => {
  it('generates curl command for GET request', () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X GET \\
'https://api.example.com/resource'`)
  })

  it('generates curl command for POST request with body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X POST \\
'https://api.example.com/resource' \\
 --data '{
  "key": "value"
}'`)
  })

  it('generates curl command for POST request with deep body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X POST \\
'https://api.example.com/resource' \\
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

  it('generates curl command with headers', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X GET \\
'https://api.example.com/resource' \\
 -H "Authorization: Bearer token"`)
  })

  it('generates curl command with query parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X GET \\
'https://api.example.com/resource?search=query'`)
  })

  it('generates curl command with all parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X PUT \\
'https://api.example.com/resource?search=query' \\
 -H "Content-Type: application/json" \\
 --data '{
  "key": "value"
}'`)
  })
})

describe('generateCodeSamplePhp', () => {
  it('generates PHP code for GET request', () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'GET';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })

  it('generates PHP code for POST request with body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'POST';
$body = json_encode({"key":"value"});

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })

  it('generates PHP code for POST request with deep body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'POST';
$body = json_encode({"key":{"nested":"value","nestedArray":[1,2,{"deep":"value"}]}});

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })

  it('generates PHP code with headers', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', { Authorization: 'Bearer token' })
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'GET';
$headers = [
    'Authorization' => 'Bearer token',
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })

  it('generates PHP code with query parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'GET', {}, null, { search: 'query' })
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'GET';
$query = http_build_query([
    'search' => 'query',
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url . '?' . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })

  it('generates PHP code with all parameters', () => {
    const request = new OARequest('https://api.example.com/resource', 'PUT', { 'Content-Type': 'application/json' }, { key: 'value' }, { search: 'query' })
    const result = generateCodeSamplePhp(request)
    expect(result).toBe(`<?php
$url = 'https://api.example.com/resource';
$method = 'PUT';
$headers = [
    'Content-Type' => 'application/json',
];
$query = http_build_query([
    'search' => 'query',
]);
$body = json_encode({"key":"value"});

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url . '?' . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`)
  })
})

describe('generateCodeSamplePython', () => {
  it('generates Python code for GET request', () => {
    const request = new OARequest('https://api.example.com/resource')
    const result = generateCodeSamplePython(request)
    expect(result).toBe(`import requests

url = 'https://api.example.com/resource'

response = requests.get(url)
print(response.json())
`)
  })

  it('generates Python code for POST request with body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = generateCodeSamplePython(request)
    expect(result).toBe(`import requests

url = 'https://api.example.com/resource'

data = {
    'key': 'value'
}

response = requests.post(url, json=data)
print(response.json())
`)
  })

  it('generates Python code for POST request with deep body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = generateCodeSamplePython(request)
    expect(result).toBe(`import requests

url = 'https://api.example.com/resource'

data = {
    'key': {
        'nested': 'value',
        'nestedArray': [
            1,
            2,
            {
                'deep': 'value'
            }
        ]
    }
}

response = requests.post(url, json=data)
print(response.json())
`)
  })

  it('generates Python code with headers', () => {
    // TODO
  })

  it('generates Python code with query parameters', () => {
    // TODO
  })

  it('generates Python code with all parameters', () => {
    // TODO
  })
})
