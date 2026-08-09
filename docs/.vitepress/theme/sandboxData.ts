import type { Ref, UnwrapRef } from 'vue'
import type { UseThemeConfig } from '../../../src/composables/useTheme'
import { ref } from 'vue'

export interface SandboxData {
  loading: Ref<boolean>
  specLoaded: Ref<boolean>
  spec: Ref<Record<string, any>>
  specUrl: Ref<string>

  themeConfig: Ref<UseThemeConfig>

  sandboxView: Ref<'edit' | 'preview'>
  hideSandboxNav: Ref<boolean>
  autoHeight: Ref<boolean>

  previewComponent: Ref<'PagesByOperation' | 'PagesBySpec' | 'PagesByTag' | 'Playground' | 'Introduction' | string>
  previewHeaders: Ref<Array<any>>
  operationId: Ref<string | null>
  tags: Ref<Array<string>>

  showSidebar: Ref<boolean>
  sidebarItemsType: Ref<'default' | 'itemsByPaths' | 'itemsByTags'>
  sidebarItemsDepth: Ref<number>
  sidebarItemsCollapsible: Ref<boolean>

  playgroundSidebarItemsType: Ref<'default' | 'itemsByPaths' | 'itemsByTags' | 'custom'>
  playgroundSidebarUseCustomTemplate: Ref<boolean>
  playgroundSidebarItemsDepth: Ref<number>
  playgroundSidebarItemsCollapsible: Ref<boolean>
  playgroundHideBranding: Ref<boolean>

  showAside: Ref<boolean>
}

function parsePreviewComponent(options: Partial<UnwrapRef<SandboxData>>) {
  const previewComponent = options.previewComponent ?? 'PagesBySpec'

  if (previewComponent === 'OASpec') {
    return 'PagesBySpec'
  }

  if (previewComponent === 'OAOperation') {
    return 'PagesByOperation'
  }

  if (previewComponent === 'OAIntroduction') {
    return 'Introduction'
  }

  if (previewComponent === 'OASpecPlayground') {
    return 'Playground'
  }

  return previewComponent
}

export function initSandboxData(options: Partial<UnwrapRef<SandboxData>> = {}): SandboxData {
  return {
    loading: ref(false),
    specLoaded: ref(options.spec && Object.keys(options.spec).length > 0),
    spec: ref(options.spec ?? undefined),
    specUrl: ref(options.specUrl ?? ''),

    themeConfig: ref(options.themeConfig ?? {}),

    sandboxView: ref(options.sandboxView ?? 'edit'),
    hideSandboxNav: ref(options.hideSandboxNav ?? false),
    autoHeight: ref(options.autoHeight ?? false),

    previewComponent: ref(parsePreviewComponent(options)),
    previewHeaders: ref([]),
    operationId: ref(options.operationId ?? null),
    tags: ref(typeof options.tags === 'string' ? [options.tags] : options.tags ?? []),

    showSidebar: ref(options.showSidebar ?? true),
    sidebarItemsType: ref(options.sidebarItemsType ?? 'default'),
    sidebarItemsDepth: ref(options.sidebarItemsDepth ?? 6),
    sidebarItemsCollapsible: ref(options.sidebarItemsCollapsible ?? true),

    playgroundSidebarItemsType: ref(options.playgroundSidebarItemsType ?? 'default'),
    playgroundSidebarUseCustomTemplate: ref(options.playgroundSidebarUseCustomTemplate ?? false),
    playgroundSidebarItemsDepth: ref(options.playgroundSidebarItemsDepth ?? 6),
    playgroundSidebarItemsCollapsible: ref(options.playgroundSidebarItemsCollapsible ?? true),
    playgroundHideBranding: ref(options.playgroundHideBranding ?? false),

    showAside: ref(options.showAside ?? false),
  }
}
