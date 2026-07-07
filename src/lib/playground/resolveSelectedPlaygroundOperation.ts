import type { ParsedOperation } from '../../types'

function decodeHashValue(hash?: string): string | undefined {
  if (!hash?.startsWith('#')) {
    return hash
  }

  const value = hash.slice(1)

  try {
    return decodeURIComponent(value)
  }
  catch {
    return value
  }
}

export function resolveSelectedPlaygroundOperation({
  hash,
  operations,
}: {
  hash?: string
  operations: ParsedOperation[]
}): ParsedOperation | null {
  const operationId = decodeHashValue(hash)

  if (operationId) {
    const matchingOperation = operations.find(operation => operation.operationId === operationId)

    if (matchingOperation) {
      return matchingOperation
    }
  }

  return operations[0] ?? null
}
