import { describe, expect, it } from 'vitest'
import { generateCodeSamples } from '../../src/lib/codeSamples/generateCodeSamples'
import { OARequest } from '../../src/lib/codeSamples/request'
import { generateCodeSampleJavaScript } from '../../src/lib/codeSamples/generateCodeSampleJavaScript'
import { generateCodeSampleCurl } from '../../src/lib/codeSamples/generateCodeSampleCurl'

describe('generateCodeSamples', () => {
  it('generates code samples for GET method', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const samples = generateCodeSamples(url, method)
    expect(samples.find(s => s.lang === 'curl').source).toBe(`curl -X GET \\
'${url}' \\
 -H "Content-Type: application/json"`)
    expect(samples.find(s => s.lang === 'javascript').source).toBe(`fetch('${url}')
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.find(s => s.lang === 'php').source).toBe(`file_get_contents("${url}");`)
    expect(samples.find(s => s.lang === 'python').source).toBe(`import requests
response = requests.get("${url}")
print(response.json())`)
  })

  it('generates code samples for POST method', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const samples = generateCodeSamples(url, method)
    expect(samples.find(s => s.lang === 'curl').source).toBe(`curl -X POST \\
'${url}' \\
 -H "Content-Type: application/json"`)
    expect(samples.find(s => s.lang === 'javascript').source).toBe(`fetch('${url}', {method:'POST'})
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.find(s => s.lang === 'php').source).toBe(`$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`)
    expect(samples.find(s => s.lang === 'python').source).toBe(`import requests
response = requests.post("${url}")
print(response.json())`)
  })

  it('handles empty URL gracefully', () => {
    const url = ''
    const method = 'GET'
    const samples = generateCodeSamples(url, method)
    expect(samples.find(s => s.lang === 'curl').source).toBe(`curl -X GET \\
'' \\
 -H "Content-Type: application/json"`)
    expect(samples.find(s => s.lang === 'javascript').source).toBe(`fetch('')
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.find(s => s.lang === 'php').source).toBe(`file_get_contents("");`)
    expect(samples.find(s => s.lang === 'python').source).toBe(`import requests
response = requests.get("")
print(response.json())`)
  })
})

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
'https://api.example.com/resource' \\
 -H "Content-Type: application/json"`)
  })

  it('generates curl command for POST request with body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: 'value' })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X POST \\
'https://api.example.com/resource' \\
 -H "Content-Type: application/json" \\
 --data '{
  "key": "value"
}'`)
  })

  it('generates curl command for POST request with deep body', () => {
    const request = new OARequest('https://api.example.com/resource', 'POST', {}, { key: { nested: 'value', nestedArray: [1, 2, { deep: 'value' }] } })
    const result = generateCodeSampleCurl(request)
    expect(result).toBe(`curl -X POST \\
'https://api.example.com/resource' \\
 -H "Content-Type: application/json" \\
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
