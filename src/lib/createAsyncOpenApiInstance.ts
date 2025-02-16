import type { ParsedOpenAPI } from '../types'
import { processAsyncOpenAPI } from './processOpenAPI/processAsyncOpenAPI'

export async function createAsyncOpenApiInstance(openapi: any) {
  let spec = openapi.getSpec() as ParsedOpenAPI
  spec = await processAsyncOpenAPI(spec)
  openapi.setSpec(spec)
  return openapi
}
