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
    <OASchemaTabs
      :schema="schema"
      :schema-json="schemaJson"
      :is-dark="props.isDark"
    />
  </div>
</template>

