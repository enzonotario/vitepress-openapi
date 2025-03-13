import { parseYAML } from 'confbox'

export async function fetchSpec(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  if (res.headers.get('content-type')?.includes('text/yaml') || url.endsWith('.yaml') || url.endsWith('.yml')) {
    return parseYAML(await res.text())
  }

  return res.json()
}
