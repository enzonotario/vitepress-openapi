<script setup>
import { useOpenapi } from 'vitepress-theme-openapi';
import {generateRequestBodySchema} from "vitepress-theme-openapi/utils/generateRequestBodySchema";

const props = defineProps({
  operation: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

const openapi = useOpenapi();

const schema = generateRequestBodySchema(openapi.getSchemas(), props.operation.requestBody);

const schemaJson = useOpenapi().propertiesTypesJson(schema, 'object');
</script>

<template>
  <div>
    <OACodeBlock
      :code="schemaJson"
      lang="json"
      label="JSON"
      :is-dark="isDark"
      class="max-h-96"
    />
  </div>
</template>

