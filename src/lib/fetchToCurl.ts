/**
 * Based on [fetch-to-curl](https://github.com/leoek/fetch-to-curl]
 * @author [leoek](https://github.com/leoek)
 * @author [enzonotario](https://github.com/enzonotario)
 */
import { formatJson } from './formatJson'

function removeLastBackslash(str: string): string {
  return str.replace(/ \\$/, '')
}

export const generateMethodArgument = (method: string): string => {
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

export const isInstanceOfHeaders = (val: any): boolean => {
  if (typeof Headers !== 'function') {
    /**
     * Environment does not support the Headers constructor
     * old internet explorer?
     */
    return false
  }
  return val instanceof Headers
}

interface HeaderParams {
  isEncode: boolean
  params: string
}

const getHeaderString = (name: string, val: any): string => ` -H "${name}: ${`${val}`.replace(/(\\|")/g, '\\$1')}"`

export const generateHeadersArgument = (headers?: any): HeaderParams => {
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

export function escapeBody(body: any): string {
  if (typeof body !== 'string') {
    return body
  }
  return body.replace(/'/g, `'\\''`)
}

export function generateBody(body: any): string {
  if (!body) {
    return ''
  }

  if (typeof body === 'object') {
    return ` --data '${escapeBody(formatJson(body))}'`
  }

  return ` --data '${escapeBody(body)}'`
}

export function generateCompress(isEncode: boolean): string {
  return isEncode ? ' --compressed' : ''
}

export const fetchToCurl = ({
  url,
  method,
  headers,
  body,
}: { url: string, method: string, headers: any, body: any }): string => {
  const headersArgument = generateHeadersArgument(headers)

  let output = `curl ${generateMethodArgument(method)}'${url}'`

  if (headersArgument.params) {
    output += ` \\\n${headersArgument.params}`
  }

  if (body) {
    output += ` \\\n${generateBody(body)}`
  }

  if (headersArgument.isEncode) {
    output += ` \\\n${generateCompress(headersArgument.isEncode)}`
  }

  return output.trim()
}

export default fetchToCurl
