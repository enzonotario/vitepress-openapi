---
aside: false
outline: false
next:
  text: 'useTheme'
  link: /composables/useTheme
---

<script setup>
import SandboxIframe from '../.vitepress/theme/components/sandbox/SandboxIframe.vue'
</script>

# Sidebar Items

The `useSidebar` composable provides functions to generate sidebar items based on the OpenAPI specification. You can generate sidebar items by operations grouped by tags, by tags, or by paths.

## Operations grouped by tags

<div class="grid grid-cols-3 gap-4">

<div class="col-span-2">

To generate sidebar items grouped by tags, you can use the `generateSidebarGroups` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({
    spec,
    // Optionally, you can specify a link prefix for all generated sidebar items. Default is `/operations/`.
    linkPrefix: '/operations/',
})

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.generateSidebarGroups({
                // Optionally, you can generate sidebar items with another link prefix. Default is `/operations/`.
                linkPrefix: '/operations/',

                // Optionally, you can specify a list of tags to generate sidebar items. Default is all tags.
                //tags: [],
            }),
        ],
    },
}
```

</div>

<SandboxIframe :sandbox-data="{sandboxView: 'preview', sidebarItemsType: 'default'}" non-interactive iframe-class="w-[1200px]" class="h-[70 sticky top-[calc(var(--vp-nav-height+16px))]vh] max-h-[700px]" />

</div>

## Items by Tags

<div class="grid grid-cols-3 gap-4">

<div class="col-span-2">

To generate sidebar items by tags, you can use the `itemsByTags` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({
    spec,
    // Optionally, you can specify a link prefix for all generated sidebar items. Default is `/tags/`.
    tagLinkPrefix: '/tags/',
})

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.itemsByTags({
                // Optionally, you can generate sidebar items with another link prefix. Default is `/tags/`.
                linkPrefix: '/tags/',

                // Optionally, you can specify a list of tags to generate sidebar items. Default is all tags.
                //tags: [],
            }),
        ],
    },
}
```

</div>

<SandboxIframe :sandbox-data="{sandboxView: 'preview', sidebarItemsType: 'itemsByTags'}" non-interactive iframe-class="w-[1200px]" class="h-[40vh] max-h-[400px] sticky top-[calc(var(--vp-nav-height)+16px)]" />

</div>

## Items by Paths

<div class="grid grid-cols-3 gap-4">

<div class="col-span-2">

To generate sidebar items by paths, you can use the `itemsByPaths` function. Configure your `.vitepress/config.js` as follows:

```ts
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' assert { type: 'json' }

const sidebar = useSidebar({ spec })

module.exports = {
    // ...
    themeConfig: {
        sidebar: [
            ...sidebar.itemsByPaths({
                /**
                 * Optionally, you can filter paths by a prefix. Default is an empty string.
                 */
                startsWith: '',

                /**
                 * Optionally, you can specify if the sidebar items are collapsible. Default is true.
                 */
                collapsible: true,

                /**
                 * Optionally, you can specify a depth for the sidebar items. Default is 6, which is the maximum VitePress sidebar depth.
                 */
                depth: 6,

                /**
                 * Optionally, you can specify a link prefix for all generated sidebar items. Default is `/operations/`.
                 */
                linkPrefix: '/operations/',

                /**
                 * Optionally, you can specify a template for the sidebar items. You can see the default value
                 * in `sidebarItemTemplate` function in the `useSidebar` composable.
                 */
                //sidebarItemTemplate: (method: string, path: string): string => `[${method}] ${path}`,

                /**
                 * Optionally, you can specify a template for the sidebar groups.
                 */
                //sidebarGroupTemplate: (path: string, depth: number): string => path,
            }),
        ],
    },
}
```

</div>

<SandboxIframe :sandbox-data="{sandboxView: 'preview', sidebarItemsType: 'itemsByPaths'}" non-interactive iframe-class="w-[1200px]" class="h-[70vh] max-h-[700px] sticky top-[calc(var(--vp-nav-height)+16px)]" />

</div>

## Examples

For more examples, check the [sidebar examples](/sidebar-examples/).
