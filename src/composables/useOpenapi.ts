let json = {}

export function useOpenapi() {
  function setSpec(spec) {
    json = spec
  }

  function getOperation(operationId) {
    if (!json.paths)
      return null

    return Object.values(json.paths).find(path => path.get.operationId === operationId).get
  }

  function getOperationPath(operationId) {
    if (!json.paths)
      return null

    return Object.keys(json.paths).find(path => json.paths[path].get.operationId === operationId)
  }

  function getBaseUrl() {
    if (!json.servers)
      return ''

    return json.servers[0].url
  }

  function getSchemas() {
    if (!json.components)
      return {}

    return json.components.schemas
  }

  function propertiesTypesJson(schema, responseType) {
    const body = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      const { type } = property

      body[key] = type
    })

    return JSON.stringify(
      responseType === 'array' ? [body] : body,
      null,
      2,
    )
  }

  function propertiesAsJson(schema, responseType) {
    const body = {}

    const propertiesKeys = Object.keys(schema.properties)

    propertiesKeys.forEach((key) => {
      const property = schema.properties[key]

      const { type } = property

      switch (type) {
        case 'string':
          body[key] = 'string'
          break
        case 'number':
        case 'integer':
          body[key] = 0
          break
        case 'boolean':
          body[key] = true
          break
        case 'array':
          body[key] = []
          break
        case 'object':
          body[key] = {}
          break
        default:
          body[key] = null
      }
    })

    return JSON.stringify(
      responseType === 'array' ? [body] : body,
      null,
      2,
    )
  }

  function getTags() {
    return Object.values(json.paths).reduce((tags, path) => {
      if (!path.get)
        return tags

      const { tags: pathTags } = path.get

      if (!pathTags)
        return tags

      pathTags.forEach((pathTag) => {
        if (!tags.includes(pathTag))
          tags.push(pathTag)
      })

      return tags
    }, [])
  }

  function getOperationCodeSamples(operationId) {
    const operation = getOperation(operationId)
    return operation['x-codeSamples'] || operation['x-code-samples'] || []
  }

  return {
    json,
    setSpec,
    getOperation,
    getOperationPath,
    getBaseUrl,
    getSchemas,
    propertiesTypesJson,
    propertiesAsJson,
    getTags,
    getOperationCodeSamples,
  }
}
