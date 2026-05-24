import { examplesPages, testsPages } from '../../../pages'

export interface PlaygroundSpecOption {
  name: string
  url: string
}

const DEFAULT_PLAYGROUND_SPECS: PlaygroundSpecOption[] = [
  {
    name: 'Argentine Rock Legends',
    url: '/openapi.json',
  },
]

export function normalizePlaygroundSpecUrl(url: string): string {
  if (url.startsWith('./docs/public/')) {
    return url.replace('./docs/public', '')
  }

  if (url.startsWith('./public/')) {
    return url.replace('./public', '')
  }

  if (url.startsWith('./')) {
    return url.slice(1)
  }

  return url
}

export function getPlaygroundSpecOptions(): PlaygroundSpecOption[] {
  return [
    ...DEFAULT_PLAYGROUND_SPECS,
    ...testsPages.map(testPage => ({
      name: testPage.label,
      url: normalizePlaygroundSpecUrl(testPage.specPath),
    })),
    ...examplesPages.map(examplePage => ({
      name: examplePage.label,
      url: examplePage.specUrl,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name))
}

export function getDefaultPlaygroundSpecUrl(specs: PlaygroundSpecOption[]): string {
  return specs.find(spec => DEFAULT_PLAYGROUND_SPECS.some(defaultSpec => defaultSpec.url === spec.url))?.url
    ?? specs[0]?.url
    ?? ''
}
