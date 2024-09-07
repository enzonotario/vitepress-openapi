export function hasExample(schema: any): boolean {
  if (schema?.example) {
    return true;
  }

  if (schema?.properties) {
    return Object.values(schema.properties).some((property) => hasExample(property));
  }

  if (schema?.items) {
    return hasExample(schema.items);
  }

  return false;
}
