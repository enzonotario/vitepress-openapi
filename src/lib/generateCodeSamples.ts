export function generateCodeSamples(url: string, method: string) {
  const jsFetchOptions = method !== 'GET' ? `, { method: "${method}" }` : ''

  const phpCode = method === 'GET'
    ? `file_get_contents("${url}");`
    : `$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`

  return {
    curl: {
      lang: 'bash',
      label: 'cURL',
      source: `curl -X ${method} ${url}`,
    },
    javascript: {
      lang: 'javascript',
      label: 'JavaScript',
      source: `fetch("${url}"${jsFetchOptions})
  .then(response => response.json())
  .then(data => console.log(data));`,
    },
    php: {
      lang: 'php',
      label: 'PHP',
      source: phpCode,
    },
    python: {
      lang: 'python',
      label: 'Python',
      source: `import requests
response = requests.${method.toLowerCase()}("${url}")
print(response.json())`,
    },
  }
}
