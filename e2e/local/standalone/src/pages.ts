import type { SidebarItem } from 'vitepress-openapi/vue'
import { useSidebar } from 'vitepress-openapi/vue'
import { examplesPages, testsPages } from '../../../../docs/pages'
import spec from '../../../../docs/public/openapi.json'
import { withBase, withoutBase } from './base'

export { spec }

export type Route
  = | { name: 'introduction' }
    | { name: 'operation', operationId: string }
    | { name: 'one-page' }
    | { name: 'test', page: (typeof testsPages)[number] }
    | { name: 'example', page: (typeof examplesPages)[number] }
    | { name: 'not-found' }

export const HOME_PATH = withBase('/example/introduction')

const RE_OPERATION = /^\/example\/operations\/([^/]+)$/
const RE_TEST = /^\/tests\/([^/]+)$/
const RE_EXAMPLE = /^\/examples\/([^/]+)$/

export function resolveRoute(pathname: string): Route {
  const path = withoutBase(pathname)

  if (path === '/example/introduction') {
    return { name: 'introduction' }
  }
  if (path === '/example/one-page') {
    return { name: 'one-page' }
  }

  const operationId = path.match(RE_OPERATION)?.[1]
  if (operationId) {
    return { name: 'operation', operationId: decodeURIComponent(operationId) }
  }

  const test = testsPages.find(page => page.slug === path.match(RE_TEST)?.[1])
  if (test) {
    return { name: 'test', page: test }
  }

  const example = examplesPages.find(page => page.slug === path.match(RE_EXAMPLE)?.[1])
  if (example) {
    return { name: 'example', page: example }
  }

  return { name: 'not-found' }
}

/** Test specs live in docs/public: this app's public dir locally, and the docs site root when deployed. */
export function testSpecUrl(page: (typeof testsPages)[number]) {
  return page.specPath.replace('./public', '')
}

// Same sections as the docs sidebar (Example, Tests, Remote Examples).
export const sidebar: SidebarItem[] = [
  {
    text: 'Example',
    items: [
      { text: 'Introduction', link: HOME_PATH },
      ...useSidebar({ spec, linkPrefix: withBase('/example/operations/') }).generateSidebarGroups(),
      { text: 'One Page', link: withBase('/example/one-page') },
    ],
  },
  {
    text: 'Tests',
    items: testsPages.map(page => ({ text: page.label, link: withBase(`/tests/${page.slug}`) })),
  },
  {
    text: 'Remote Examples',
    items: examplesPages.map(page => ({ text: page.label, link: withBase(`/examples/${page.slug}`) })),
  },
]
