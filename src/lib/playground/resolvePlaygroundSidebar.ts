import type { DefaultTheme } from 'vitepress'

function ensureStartingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function addBase(
  items: DefaultTheme.SidebarItem[],
  base?: string,
): DefaultTheme.SidebarItem[] {
  return items.map((item) => {
    const resolvedBase = item.base || base

    return {
      ...item,
      link: resolvedBase && item.link ? `${resolvedBase}${item.link}` : item.link,
      items: item.items ? addBase(item.items, resolvedBase) : item.items,
    }
  })
}

export function resolvePlaygroundSidebar(
  sidebar: DefaultTheme.Sidebar | undefined,
  path: string,
): DefaultTheme.SidebarItem[] | null {
  if (Array.isArray(sidebar)) {
    return addBase(sidebar)
  }

  if (!sidebar) {
    return null
  }

  const normalizedPath = ensureStartingSlash(path)
  const matchedDir = Object.keys(sidebar)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find(dir => normalizedPath.startsWith(ensureStartingSlash(dir)))

  if (!matchedDir) {
    return null
  }

  const matchedSidebar = sidebar[matchedDir]

  return Array.isArray(matchedSidebar)
    ? addBase(matchedSidebar)
    : addBase(matchedSidebar.items, matchedSidebar.base)
}
