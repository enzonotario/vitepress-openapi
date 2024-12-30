<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/ui/tabs'
import { useScopeConfiguration } from '../composables/useScopeConfiguration'

const scopes = [
  {
    name: 'global',
    label: 'Global spec',
  },
  {
    name: 'in-markdown',
    label: 'In Markdown spec',
  },
]

// const vModel = ref('global')

const scopeConfiguration = useScopeConfiguration()
</script>

<template>
  <div class="relative rounded border border-[var(--vp-c-divider)]">
    <Tabs
      :default-value="scopeConfiguration.currentScope"
    >
      <div class="bg-muted rounded-t z-10">
        <TabsList class="flex flex-row justify-start bg-transparent">
          <TabsTrigger
            v-for="scope in scopes"
            :key="scope.name"
            :value="scope.name"
            variant="schemaTabs"
            class="h-full"
          >
            {{ scope.label }}
          </TabsTrigger>
        </TabsList>
      </div>

      <div class="px-2">
        <TabsContent
          v-for="scope in scopes"
          :key="scope.name"
          :value="scope.name"
        >
          <slot :name="scope.name" />
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>
