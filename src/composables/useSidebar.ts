import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { DefaultTheme } from 'vitepress'
import type { OpenAPIDocument } from '../types'
import { httpVerbs } from '../index'
import { createOpenApiSpec } from '../lib/createOpenApiSpec'
import { parseOpenapi } from '../lib/parser/parseOpenapi'
import { cleanSidebarItems } from '../lib/sidebar/cleanSidebarItems'
import { generateSidebarItemsByPaths } from '../lib/sidebar/generateSidebarItemsByPaths'

type MethodAliases = Record<string, string>

export interface SidebarItemTemplateParams {
  method: OpenAPIV3.HttpMethods
  path: string
  title?: string
}

export type SidebarItemTemplateFn = (
  params: SidebarItemTemplateParams
) => string

export interface SidebarGroupTemplateParams {
  path: string
  depth: number
}

export type SidebarGroupTemplateFn = (
  params: SidebarGroupTemplateParams
) => string

export interface SidebarItemTemplateForMethodPathParams {
  method: OpenAPIV3.HttpMethods
  path: string
  sidebarItemTemplate?: SidebarItemTemplateFn
}

export interface SidebarConfig {
  spec?: OpenAPIDocument | null
  linkPrefix?: string
  tagLinkPrefix?: string
  defaultTag?: string
  methodAliases?: MethodAliases
  sidebarItemTemplate?: SidebarItemTemplateFn
  sidebarGroupTemplate?: SidebarGroupTemplateFn
}

export interface SidebarGroupConfig {
  tag: string | string[]
  text?: string
  linkPrefix?: string
  sidebarItemTemplate?: SidebarItemTemplateFn
  sidebarGroupTemplate?: SidebarGroupTemplateFn
}

export interface SidebarGroupsConfig {
  tags?: string[] | null
  linkPrefix?: string | null
  sidebarItemTemplate?: SidebarItemTemplateFn
  sidebarGroupTemplate?: SidebarGroupTemplateFn
}

export interface OASidebarItem extends DefaultTheme.SidebarItem {
  path?: string
  isOperation?: boolean
  flattenedItems?: OASidebarItem[]
}

interface OpenAPIOperation extends OpenAPIV3.OperationObject {
  'x-sidebar-title'?: string
  'operationId': string
}

const DEFAULT_CONFIG: Required<Omit<SidebarConfig, 'methodAliases' | 'spec' | 'sidebarItemTemplate' | 'sidebarGroupTemplate'>> = {
  linkPrefix: '/operations/',
  tagLinkPrefix: '/tags/',
  defaultTag: 'Default',
} as const

function defaultGroupTemplate({ path }: SidebarGroupTemplateParams): string {
  return path
}

export function useSidebar({
  spec,
  linkPrefix = DEFAULT_CONFIG.linkPrefix,
  tagLinkPrefix = DEFAULT_CONFIG.tagLinkPrefix,
  defaultTag = DEFAULT_CONFIG.defaultTag,
  methodAliases = {},
  sidebarItemTemplate,
  sidebarGroupTemplate,
}: SidebarConfig = {}) {
  let openApiInstance: ReturnType<typeof createOpenApiSpec> | null = null

  function getOpenApi() {
    if (!spec) {
      throw new Error('OpenAPI spec is not provided.')
    }

    if (!openApiInstance) {
      openApiInstance = createOpenApiSpec({
        spec: parseOpenapi().transformSync({
          spec,
          defaultTag,
        }),
      })
    }

    return openApiInstance
  }

  const _globalItemTemplate: SidebarItemTemplateFn = sidebarItemTemplate || (({ method, path, title }) => {
    const resolvedMethod = methodAliases[method] || method.toUpperCase()
    const displayText = title || path
    return `<span class="OASidebarItem group/oaOperationLink">
        <span class="OASidebarItem-badge OAMethodBadge--${method.toLowerCase()}">${resolvedMethod}</span>
        <span class="OASidebarItem-text text">${displayText}</span>
      </span>`
  })

  const _globalGroupTemplate: SidebarGroupTemplateFn = sidebarGroupTemplate || defaultGroupTemplate

  function sidebarItemTemplateForMethodPath({
    method,
    path,
    sidebarItemTemplate,
  }: SidebarItemTemplateForMethodPathParams): string {
    const operation = getOpenApi().getPaths()?.[path]?.[method] as OpenAPIOperation | undefined
    if (!operation) {
      return `[${method.toUpperCase()}] ${path}`
    }

    const { summary } = operation

    const sidebarTitle = operation['x-sidebar-title'] || summary || `${method.toUpperCase()} ${path}`

    const finalTemplate = sidebarItemTemplate || _globalItemTemplate

    return finalTemplate({ method, path, title: sidebarTitle })
  }

  function generateSidebarItem(
    method: OpenAPIV3.HttpMethods,
    path: string,
    itemLinkPrefix: string = linkPrefix,
    localItemTemplate?: SidebarItemTemplateFn,
  ): OASidebarItem | null {
    const operation = getOpenApi().getPaths()?.[path]?.[method] as OpenAPIOperation | undefined

    if (!operation) {
      return null
    }

    const operationId = operation.operationId

    return {
      text: sidebarItemTemplateForMethodPath({ method, path, sidebarItemTemplate: localItemTemplate }),
      link: `${itemLinkPrefix}${operationId}`,
    }
  }

  function generateSidebarGroup({
    tag,
    text = '',
    linkPrefix: groupLinkPrefix = linkPrefix,
    sidebarItemTemplate: localItemTemplate,
    sidebarGroupTemplate: localGroupTemplate,
  }: SidebarGroupConfig): OASidebarItem {
    const paths = getOpenApi().getPaths()

    if (!paths) {
      return {
        text: '',
        items: [],
      }
    }

    const includeTags = Array.isArray(tag) ? tag : [tag]

    const items = Object.entries(paths)
      .flatMap(([path, pathObject]) =>
        httpVerbs
          .map((method) => {
            const operation = pathObject?.[method] as OpenAPIOperation | undefined

            if (!operation) {
              return null
            }

            const shouldInclude
                  = includeTags.length === 0
                    || includeTags.every(tagName => operation.tags?.includes(tagName))

            if (shouldInclude) {
              return generateSidebarItem(method as OpenAPIV3.HttpMethods, path, groupLinkPrefix, localItemTemplate)
            }

            return null
          })
          .filter((item): item is OASidebarItem => item !== null),
      )

    const finalGroupTemplate = localGroupTemplate || _globalGroupTemplate

    return {
      text: finalGroupTemplate({ path: text, depth: 0 }),
      items,
    }
  }

  function generateSidebarGroups({
    tags = undefined,
    linkPrefix: groupsLinkPrefix = linkPrefix,
    sidebarItemTemplate: localItemTemplate,
    sidebarGroupTemplate: localGroupTemplate,
  }: SidebarGroupsConfig = {}): OASidebarItem[] {
    if (tags === undefined) {
      tags = getOpenApi().getOperationsTags()
    }

    if (!getOpenApi().getPaths()) {
      return []
    }

    const taggedGroups = (tags ?? []).map(tag =>
      generateSidebarGroup({
        tag,
        text: tag,
        linkPrefix: groupsLinkPrefix || tagLinkPrefix,
        sidebarItemTemplate: localItemTemplate,
        sidebarGroupTemplate: localGroupTemplate,
      }),
    )

    const pathsWithoutTags = getOpenApi().getPathsWithoutTags()
    const hasUntagged = Object.keys(pathsWithoutTags).length > 0

    if (hasUntagged) {
      const untaggedGroup = generateSidebarGroup({
        tag: [],
        text: '',
        linkPrefix: groupsLinkPrefix || tagLinkPrefix,
        sidebarItemTemplate: localItemTemplate,
        sidebarGroupTemplate: localGroupTemplate,
      })

      return [...taggedGroups, untaggedGroup]
    }

    return taggedGroups
  }

  function itemsByTags({
    tags = undefined,
    linkPrefix: tagsLinkPrefix = tagLinkPrefix,
  }: SidebarGroupsConfig = {}): OASidebarItem[] {
    if (tags === undefined) {
      tags = getOpenApi().getFilteredTags().map(tag => tag.name || '')
    }

    if (!getOpenApi().getPaths() || !tags) {
      return []
    }

    return tags.map(tag => ({
      text: tag,
      link: `${tagsLinkPrefix}${tag}`,
    }))
  }

  function itemsByPaths({
    startsWith = '',
    collapsible = true,
    depth = 6,
    linkPrefix: itemLinkPrefix = linkPrefix,
    sidebarItemTemplate,
    sidebarGroupTemplate,
  }: {
    startsWith?: string
    collapsible?: boolean
    depth?: number
    linkPrefix?: string
    sidebarItemTemplate?: SidebarItemTemplateFn
    sidebarGroupTemplate?: SidebarGroupTemplateFn
  } = {}): DefaultTheme.SidebarItem[] {
    const paths = getOpenApi().getPaths()

    const itemTemplateForMethodPath = ({
      method,
      path,
    }: SidebarItemTemplateForMethodPathParams) => sidebarItemTemplateForMethodPath({
      method,
      path,
      sidebarItemTemplate,
    })

    const sidebarItems = generateSidebarItemsByPaths({
      paths,
      startsWith,
      collapsible,
      depth,
      itemLinkPrefix,
      sidebarItemTemplate: itemTemplateForMethodPath,
      sidebarGroupTemplate,
    })

    return cleanSidebarItems(sidebarItems) as DefaultTheme.SidebarItem[]
  }

  return {
    sidebarItemTemplate: _globalItemTemplate,
    sidebarGroupTemplate: _globalGroupTemplate,
    generateSidebarItem,
    generateSidebarGroup,
    generateSidebarGroups,
    itemsByTags,
    itemsByPaths,
    // TODO: Add `itemsByOperations` function
  }
}
