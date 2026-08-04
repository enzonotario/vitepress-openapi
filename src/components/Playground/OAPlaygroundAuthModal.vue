<script setup lang="ts">
import type { PlaygroundResponse } from '../../composables/usePlayground'
import type { OpenApiSpecInstance } from '@/lib/spec/createOpenApiSpec'
import { useI18n } from '@byjohann/vue-i18n'
import { computed, ref, watch } from 'vue'
import {
  extractAuthToken,
} from '@/lib/playground/authPlayground'
import { setSharedAuthorizationValue } from '@/lib/playground/sharedAuthorizationStorage'
import { getGlobalOpenapi, injectOpenapi } from '../../composables/useOpenapi'
import { useTheme } from '../../composables/useTheme'
import OAOperationContext from '../Feature/OAOperationContext.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import OAPlayground from './OAPlayground.vue'

const props = defineProps<{
  open: boolean
  schemeName: string
  operationIds: string[]
  openapi?: OpenApiSpecInstance | null
}>()

const emits = defineEmits<{
  'update:open': [value: boolean]
  'authenticated': [payload: { token: string, schemeName: string }]
}>()

const { t } = useI18n()
const themeConfig = useTheme()

const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const injectedOpenapi = injectOpenapi()
const openapi = computed(() => props.openapi ?? injectedOpenapi ?? getGlobalOpenapi())

const selectedOperationId = ref(props.operationIds[0] ?? '')

watch(() => props.operationIds, (ids) => {
  if (!ids.includes(selectedOperationId.value)) {
    selectedOperationId.value = ids[0] ?? ''
  }
}, { immediate: true })

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    errorMessage.value = null
    successMessage.value = null
  }
})

const tokenFields = computed(() =>
  themeConfig.getAuthPlaygroundConfig().tokenResponseFields
  ?? ['access_token', 'token', 'accessToken'],
)

function setOpen(value: boolean) {
  emits('update:open', value)
}

function onResponse(response: PlaygroundResponse) {
  errorMessage.value = null
  successMessage.value = null

  const status = response.status
  if (status == null || status < 200 || status >= 300) {
    errorMessage.value = t('Auth playground error')
    return
  }

  const token = extractAuthToken(response.body, tokenFields.value)
  if (!token) {
    errorMessage.value = t('Auth playground missing token')
    return
  }

  const persistAuth = themeConfig.getStoragePersistAuth()
  setSharedAuthorizationValue(props.schemeName, token, {
    prefix: themeConfig.getStoragePrefix(),
    persist: persistAuth,
  })

  successMessage.value = t('Auth playground success')
  emits('authenticated', { token, schemeName: props.schemeName })
  setOpen(false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="setOpen">
    <DialogContent class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ t('Authentication') }}</DialogTitle>
        <DialogDescription>
          {{ t('Auth playground description') }}
        </DialogDescription>
      </DialogHeader>

      <p v-if="errorMessage" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>
      <p v-else-if="successMessage" class="text-sm text-green-600 dark:text-green-400">
        {{ successMessage }}
      </p>

      <div v-if="openapi && props.operationIds.length" class="flex flex-col gap-3">
        <Tabs
          v-if="props.operationIds.length > 1"
          v-model="selectedOperationId"
        >
          <TabsList class="w-full justify-start overflow-x-auto">
            <TabsTrigger
              v-for="operationId in props.operationIds"
              :key="operationId"
              :value="operationId"
            >
              {{ operationId }}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            v-for="operationId in props.operationIds"
            :key="operationId"
            :value="operationId"
          >
            <OAOperationContext
              :openapi="openapi"
              :operation-id="operationId"
            >
              <template #default="ctx">
                <OAPlayground
                  :operation-id="operationId"
                  :path="ctx.path"
                  :method="ctx.method"
                  :servers="ctx.servers"
                  :parameters="ctx.parameters"
                  :request-body="ctx.requestBody"
                  :security-ui="ctx.securityUi"
                  source="auth-modal"
                  compact
                  @response="onResponse"
                />
              </template>
            </OAOperationContext>
          </TabsContent>
        </Tabs>

        <OAOperationContext
          v-else
          :openapi="openapi"
          :operation-id="selectedOperationId"
        >
          <template #default="ctx">
            <OAPlayground
              :operation-id="selectedOperationId"
              :path="ctx.path"
              :method="ctx.method"
              :servers="ctx.servers"
              :parameters="ctx.parameters"
              :request-body="ctx.requestBody"
              :security-ui="ctx.securityUi"
              source="auth-modal"
              compact
              @response="onResponse"
            />
          </template>
        </OAOperationContext>
      </div>
    </DialogContent>
  </Dialog>
</template>
