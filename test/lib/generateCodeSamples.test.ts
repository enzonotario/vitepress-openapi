import { describe, expect, it } from 'vitest'
import { generateCodeSamples } from '../../src/lib/generateCodeSamples'

describe('generateCodeSamples', () => {
  it('generates code samples for GET method', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'GET'
    const samples = generateCodeSamples(url, method)
    expect(samples.curl.source).toBe(`curl -X GET ${url}`)
    expect(samples.javascript.source).toBe(`fetch("${url}")
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.php.source).toBe(`file_get_contents("${url}");`)
    expect(samples.python.source).toBe(`import requests
response = requests.get("${url}")
print(response.json())`)
  })

  it('generates code samples for POST method', () => {
    const url = 'https://api.example.com/path/testOperation'
    const method = 'POST'
    const samples = generateCodeSamples(url, method)
    expect(samples.curl.source).toBe(`curl -X POST ${url}`)
    expect(samples.javascript.source).toBe(`fetch("${url}", { method: "POST" })
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.php.source).toBe(`$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`)
    expect(samples.python.source).toBe(`import requests
response = requests.post("${url}")
print(response.json())`)
  })

  it('handles empty URL gracefully', () => {
    const url = ''
    const method = 'GET'
    const samples = generateCodeSamples(url, method)
    expect(samples.curl.source).toBe(`curl -X GET `)
    expect(samples.javascript.source).toBe(`fetch("")
  .then(response => response.json())
  .then(data => console.log(data));`)
    expect(samples.php.source).toBe(`file_get_contents("");`)
    expect(samples.python.source).toBe(`import requests
response = requests.get("")
print(response.json())`)
  })
})
