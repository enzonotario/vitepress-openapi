---
layout: page
sidebar: false
title: vitepress-openapi
---

<script setup>
import spec from '../public/openapi.json' with { type: 'json' }
import { useSidebar } from 'vitepress-openapi'
import { useTheme } from 'vitepress-openapi/client'

const sidebar = useSidebar({
  spec,
})

useTheme({
  playground: {
    sidebar: [
      {
        text: 'Rock Artists',
        items: [
          sidebar.generateSidebarGroup({
            tag: 'Artists',
            text: '',
            linkPrefix: '#',
          }),
        ],
      },
      {
        text: 'Auth',
        items: [
          sidebar.generateSidebarGroup({
            tag: 'Authentication',
            text: '',
            linkPrefix: '#',
          }),
        ],
      },
    ],
  },
})
</script>

<OASpecPlayground :spec="spec" />
