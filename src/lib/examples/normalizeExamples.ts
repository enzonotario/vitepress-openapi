import { isNamedExamplesMap } from './isNamedExamplesMap'

export interface NormalizedExample {
  name: string
  value: any
  summary?: string
}

export function normalizeExamples(values: any): NormalizedExample[] | null {
  if (values === null || values === undefined) {
    return null
  }

  if (Array.isArray(values)) {
    return values.map((value: any) => ({
      name: typeof value === 'object' ? JSON.stringify(value) : String(value),
      value,
    }))
  }

  if (values && typeof values === 'object') {
    const record = values as Record<string, any>
    if (isNamedExamplesMap(record)) {
      const keys = Object.keys(record)
      return keys.map((key) => {
        const entry = record[key]
        let value: any = entry
        let summary: string | undefined
        if (entry && typeof entry === 'object') {
          summary = (entry as any).summary
          if ('value' in (entry as any)) {
            value = (entry as any).value
          }
          else if ('$ref' in (entry as any)) {
            value = { $ref: (entry as any).$ref }
          }
          else if ('externalValue' in (entry as any)) {
            value = (entry as any).externalValue
          }
          else {
            value = null
          }
        }
        return {
          name: key,
          value,
          summary,
        }
      })
    }
    return [{ name: JSON.stringify(values), value: values }]
  }

  return [
    {
      name: String(values),
      value: values,
    },
  ]
}
