import type { OARequest } from './request'

export function generateCodeSampleCurl(request: OARequest) {
  const headersArgument = generateHeadersArgument(request.headers)

  let output = `curl ${generateMethodArgument(request.method)}'${request.url}${Object.keys(request.query ?? {}).length ? `?${new URLSearchParams(request.query).toString()}` : ''}'`

  if (headersArgument.params) {
    output += ` \\\n${headersArgument.params}`
  }

  if (request.body) {
    output += ` \\\n${generateBody(JSON.stringify(request.body, null, 2))}`
  }

  if (headersArgument.isEncode) {
    output += ` \\\n${generateCompress(headersArgument.isEncode)}`
  }

  return output.trim()
}

/**
 * Based on [fetch-to-curl](https://github.com/leoek/fetch-to-curl]
 * @author [leoek](https://github.com/leoek)
 * @author [enzonotario](https://github.com/enzonotario)
 */

interface HeaderParams {
  isEncode: boolean
  params: string
}

function removeLastBackslash(str: string): string {
  return str.replace(/ \\$/, '')
}

function generateMethodArgument(method: string): string {
  if (!method) {
    return ''
  }

  const type: { [key: string]: string } = {
    GET: '-X GET \\\n',
    POST: '-X POST \\\n',
    PUT: '-X PUT \\\n',
    PATCH: '-X PATCH \\\n',
    DELETE: '-X DELETE \\\n',
    HEAD: '-X HEAD \\\n',
    OPTIONS: '-X OPTIONS\\\n ',
  }

  return type[method.toUpperCase()] || ''
}

function isInstanceOfHeaders(val: any): boolean {
  if (typeof Headers !== 'function') {
    /**
     * Environment does not support the Headers constructor
     * old internet explorer?
     */
    return false
  }
  return val instanceof Headers
}

function getHeaderString(name: string, val: any): string {
  return ` -H "${name}: ${`${val}`.replace(/(\\|")/g, '\\$1')}"`
}

function generateHeadersArgument(headers?: any): HeaderParams {
  if (!headers || Object.keys(headers).length === 0) {
    return {
      params: '',
      isEncode: false,
    }
  }

  let isEncode = false
  let headerParam = ''
  if (isInstanceOfHeaders(headers)) {
    headers.forEach((val: any, name: string) => {
      if (name.toLocaleLowerCase() !== 'content-length') {
        headerParam += `${getHeaderString(name, val)} \\\n`
      }
      if (name.toLocaleLowerCase() === 'accept-encoding') {
        isEncode = true
      }
    })
  } else if (headers) {
    Object.keys(headers).forEach((name) => {
      if (name.toLocaleLowerCase() !== 'content-length') {
        headerParam += `${getHeaderString(name, headers[name])} \\\n`
      }
      if (name.toLocaleLowerCase() === 'accept-encoding') {
        isEncode = true
      }
    })
  }

  headerParam = headerParam.trim()

  headerParam = removeLastBackslash(headerParam)

  headerParam = ` ${headerParam}`

  return {
    params: headerParam,
    isEncode,
  }
}

function escapeBody(body: any): string {
  if (typeof body !== 'string') {
    return body
  }
  return body.replace(/'/g, `'\\''`)
}

function generateBody(body: any): string {
  if (!body) {
    return ''
  }

  if (typeof body === 'object') {
    return ` --data '${escapeBody(JSON.stringify(body))}'`
  }

  return ` --data '${escapeBody(body)}'`
}

function generateCompress(isEncode: boolean): string {
  return isEncode ? ' --compressed' : ''
}
