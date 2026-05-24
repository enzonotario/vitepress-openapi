import type { ParsedOperation } from '../../types'

export function resolveSelectedPlaygroundOperation({
  hash,
  operations,
}: {
  hash?: string
  operations: ParsedOperation[]
}): ParsedOperation | null {
  const operationId = hash?.startsWith('#')
    ? decodeURIComponent(hash.slice(1))
    : hash

  if (operationId) {
    const matchingOperation = operations.find(operation => operation.operationId === operationId)

    if (matchingOperation) {
      return matchingOperation
    }
  }

  return operations[0] ?? null
}
