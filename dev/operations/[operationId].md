---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useOpenapi, useTheme } from 'vitepress-openapi'

const route = useRoute()

const { isDark } = useData()

const openapi = useOpenapi()

const themeConfig = useTheme()

const operationId = route.data.params.operationId

const operation = openapi.getOperation(operationId)

themeConfig.setResponseCodeSelector(
    Object.keys(operation.responses).length > 3 ? 'select' : 'tabs'
)
</script>

<OAOperation :operationId="operationId" :isDark="isDark" />
