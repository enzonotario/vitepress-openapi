import { describe, expect, it } from 'vitest'
import { parseOpenapi } from '../../../src/lib/parser/parseOpenapi'

function getJsSample(operation: { codeSamples?: Array<{ lang: string, source: string }> }) {
  return operation.codeSamples?.find(sample => sample.lang === 'javascript')?.source ?? ''
}

describe('generateCodeSamples apiKey authorizations', () => {
  it('uses the scheme declared header name, not the components.securitySchemes key', async () => {
    const spec = await parseOpenapi().parseAsync({
      spec: {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        servers: [{ url: 'http://localhost:5226' }],
        paths: {
          '/downloads': {
            get: {
              operationId: 'listDownloads',
              security: [{ managementKey: [] }],
              responses: { 200: { description: 'ok' } },
            },
          },
        },
        components: {
          securitySchemes: {
            managementKey: {
              type: 'apiKey',
              in: 'header',
              name: 'X-Management-Key',
            },
          },
        },
      },
    })

    const source = getJsSample(spec.paths!['/downloads'].get as any)

    expect(source).toContain('X-Management-Key')
    expect(source).not.toContain('Managementkey:')
  })

  it('renders cookie apiKey schemes as a Cookie request header in JS samples', async () => {
    const spec = await parseOpenapi().parseAsync({
      spec: {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        servers: [{ url: 'http://localhost:5225' }],
        paths: {
          '/api/v2/torrents/info': {
            get: {
              operationId: 'torrentInfo',
              security: [{ sid: [] }],
              responses: { 200: { description: 'ok' } },
            },
          },
        },
        components: {
          securitySchemes: {
            sid: {
              type: 'apiKey',
              in: 'cookie',
              name: 'SID',
            },
          },
        },
      },
    })

    const source = getJsSample(spec.paths!['/api/v2/torrents/info'].get as any)

    expect(source).toMatch(/['"]?Cookie['"]?\s*:/)
    expect(source).toContain('SID=')
    expect(source).not.toContain('Set-Cookie')
  })
})
