<script setup>
import Parameter from './Parameter.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  parameters: {
    type: Array,
    required: true,
  },
})

const pathParameters = props.parameters.filter(parameter => parameter.in === 'path')

const queryParameters = props.parameters.filter(parameter => parameter.in === 'query')
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="pathParameters.length"
      class="space-y-4"
    >
      <h3>
        {{ $t('Path Parameters') }}
      </h3>

      <Parameter
        v-for="parameter in pathParameters"
        :key="parameter.name"
        :parameter="parameter"
      />
    </div>

    <div
      v-if="queryParameters.length"
      class="space-y-4"
    >
      <h3>
        {{ $t('Query Parameters') }}
      </h3>

      <Parameter
        v-for="parameter in queryParameters"
        :key="parameter.name"
        :parameter="parameter"
      />
    </div>
  </div>
</template>
