import type { OARequest } from './request'

export function generateCodeSamplePhp({ url, method, headers, body, query }: OARequest): string {
  let phpCode = `<?php\n`

  phpCode += `$url = '${url}';\n`

  phpCode += `$method = '${method}';\n\n`

  if (Object.keys(headers).length > 0) {
    phpCode += `$headers = [\n`
    for (const [key, value] of Object.entries(headers)) {
      phpCode += `    '${key}' => '${value}',\n`
    }
    phpCode += `];\n\n`
  }

  if (Object.keys(query).length > 0) {
    phpCode += `$query = http_build_query([\n`
    for (const [key, value] of Object.entries(query)) {
      phpCode += `    '${key}' => '${value}',\n`
    }
    phpCode += `]);\n\n`
  }

  if (body) {
    phpCode += `$body = json_encode(${JSON.stringify(body)});\n\n`
  }

  phpCode += `$ch = curl_init();\n`
  phpCode += `curl_setopt($ch, CURLOPT_URL, $url${Object.keys(query).length ? ` . '?' . $query` : ''});\n`
  phpCode += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`
  phpCode += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);\n`

  if (Object.keys(headers).length > 0) {
    phpCode += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n`
  }

  if (body) {
    phpCode += `curl_setopt($ch, CURLOPT_POSTFIELDS, $body);\n`
  }

  phpCode += `\n$response = curl_exec($ch);\n`
  phpCode += `curl_close($ch);\n\n`
  phpCode += `echo $response;\n`

  phpCode += `?>`

  return phpCode
}
