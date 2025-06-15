<script setup>
import { computed, defineProps } from 'vue'
import { OAOperationContext } from '../../components'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  operation: {
    type: Object,
    required: true,
  },
  openapi: {
    type: Object,
    required: true,
  },
})

const themeConfig = useTheme()

const operationSlots = computed(
  () => themeConfig
    .getOperationSlots()
    .filter(slot => !themeConfig.getOperationHiddenSlots().includes(slot)),
)

const operationCols = computed(() => themeConfig.getOperationCols())

const shouldBuildRequest = computed(
  () => ['playground', 'try-it', 'code-samples'].some(slot => operationSlots.value.includes(slot)),
)
</script>

<template>
  <OAOperationContext
    :openapi="props.openapi"
    :operation-id="props.id"
    :should-build-request="shouldBuildRequest"
  >
    <template #default="operationContext">
      <div
        v-if="props.operation"
        class="OAPath flex flex-col space-y-4"
      >
        <template v-if="operationSlots.includes('header')">
          <slot
            name="header"
            :operation="props.operation"
            :method="operationContext.method"
            :path="operationContext.path"
            :deprecated="props.operation.deprecated"
          />
        </template>

        <template v-if="operationSlots.includes('tags')">
          <slot
            name="tags"
            :operation="props.operation"
            :method="operationContext.method"
            :path="operationContext.path"
            :tags="props.operation.tags"
          />
        </template>

        <div
          :class="{
            'sm:grid-cols-1': operationCols === 1,
            'sm:grid-cols-2': operationCols === 2,
          }"
          class="relative grid grid-cols-1"
        >
          <div class="OAPathContentStart flex flex-col">
            <div class="flex flex-col gap-4">
              <div
                v-if="operationSlots.includes('path')"
                :class="{
                  'sm:hidden': operationCols === 2,
                }"
              >
                <slot
                  name="path"
                  :operation-id="props.id"
                  :operation="props.operation"
                  :method="operationContext.method"
                  :path="operationContext.path"
                  :hide-base-url="!themeConfig.getShowBaseURL()"
                  :deprecated="props.operation.deprecated"
                  :servers="operationContext.servers"
                  :base-url="operationContext.operationData.playground.selectedServer.value"
                />
              </div>

              <template v-if="operationSlots.includes('description')">
                <slot
                  name="description"
                  :operation="props.operation"
                  :method="operationContext.method"
                  :path="operationContext.path"
                />
              </template>
            </div>

            <template v-if="operationSlots.includes('security')">
              <slot
                v-if="operationContext.securityUi.length"
                name="security"
                :operation="props.operation"
                :method="operationContext.method"
                :path="operationContext.path"
                :security-ui="operationContext.securityUi"
                :selected-scheme-id="operationContext.operationData.security.selectedSchemeId.value"
              />
            </template>

            <template v-if="operationSlots.includes('parameters')">
              <slot
                v-if="operationContext.parameters?.length"
                name="parameters"
                :operation-id="props.id"
                :parameters="operationContext.parameters"
              />
            </template>

            <template v-if="operationSlots.includes('request-body')">
              <slot
                v-if="operationContext.requestBody"
                name="request-body"
                :operation-id="props.id"
                :request-body="operationContext.requestBody"
              />
            </template>

            <template v-if="operationSlots.includes('responses')">
              <slot
                v-if="operationContext.responses"
                name="responses"
                :operation-id="props.id"
                :responses="operationContext.responses"
              />
            </template>
          </div>

          <div class="flex flex-col">
            <div
              class="OAPathContentEnd sticky top-[100px] inset-x-0 flex flex-col"
              :class="{
                '!px-0': operationCols === 1,
              }"
            >
              <div
                v-if="operationSlots.includes('path') && operationCols === 2"
                :class="{
                  'hidden sm:block sm:mb-2': operationCols === 2,
                }"
              >
                <slot
                  name="path"
                  :operation-id="props.id"
                  :operation="props.operation"
                  :method="operationContext.method"
                  :path="operationContext.path"
                  :hide-base-url="!themeConfig.getShowBaseURL()"
                  :deprecated="props.operation.deprecated"
                  :servers="operationContext.servers"
                  :base-url="operationContext.operationData.playground.selectedServer.value"
                />
              </div>

              <div v-if="operationSlots.includes('try-it') || operationSlots.includes('playground')">
                <slot
                  name="playground"
                  :operation-id="props.id"
                  :path="operationContext.path"
                  :method="operationContext.method"
                  :parameters="operationContext.parameters"
                  :request-body="operationContext.requestBody"
                  :security-ui="operationContext.securityUi"
                  :servers="operationContext.servers"
                />
              </div>

              <div v-if="operationSlots.includes('code-samples')">
                <slot
                  name="code-samples"
                  :operation-id="props.id"
                  :operation="props.operation"
                  :method="operationContext.method"
                  :path="operationContext.path"
                  :code-samples="operationContext.codeSamples"
                />
              </div>
            </div>
          </div>
        </div>

        <template v-if="operationSlots.includes('branding')">
          <slot
            name="branding"
            :operation-id="props.id"
            :operation="props.operation"
            :method="operationContext.method"
            :path="operationContext.path"
          />
        </template>

        <template v-if="operationSlots.includes('footer')">
          <slot
            name="footer"
            :operation-id="props.id"
            :operation="props.operation"
            :method="operationContext.method"
            :path="operationContext.path"
          />
        </template>
      </div>
    </template>
  </OAOperationContext>
</template>
