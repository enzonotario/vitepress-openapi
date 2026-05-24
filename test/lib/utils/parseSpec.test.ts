import { describe, expect, it, vi } from 'vitest'
import { parseSpec } from '../../../src/lib/utils/parseSpec'

describe('parseSpec', () => {
  it('parses JSON string spec', () => {
    const jsonSpec = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
    })

    const result = parseSpec(jsonSpec)

    expect(result).toEqual({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
    })
  })

  it('parses YAML string spec', () => {
    const yamlSpec = `
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
`

    const result = parseSpec(yamlSpec)

    expect(result).toEqual({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
    })
  })

  it('returns object spec as-is', () => {
    const objectSpec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
    }

    const result = parseSpec(objectSpec)

    expect(result).toBe(objectSpec)
  })

  it('handles invalid string spec', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = parseSpec('invalid: yaml: : :')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing spec', expect.any(Error))
    expect(result).toEqual({})

    consoleErrorSpy.mockRestore()
  })

  it('handles invalid spec format', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = parseSpec(null as any)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid spec format')
    expect(result).toEqual({})

    consoleErrorSpy.mockRestore()
  })

  it('handles complex nested YAML spec', () => {
    const yamlSpec = `
openapi: 3.0.0
info:
  title: Complex API
  version: 2.0.0
paths:
  /users:
    get:
      operationId: getUsers
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
`

    const result = parseSpec(yamlSpec)

    expect(result.openapi).toBe('3.0.0')
    expect(result.info.title).toBe('Complex API')
    expect(result.paths['/users'].get.operationId).toBe('getUsers')
    expect(result.paths['/users'].get.parameters[0].name).toBe('limit')
  })

  it('handles empty string', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = parseSpec('')

    expect(result).toEqual({})

    consoleErrorSpy.mockRestore()
  })

  it('handles empty object', () => {
    const result = parseSpec({})

    expect(result).toEqual({})
  })
})
