export function resolveRef(ref: string, schemas: any) {
  const refName = ref.split('/').pop()
  return schemas[refName]
}
