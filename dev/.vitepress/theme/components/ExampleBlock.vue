<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col">
    <slot name="code" />

    <details class="rounded border" style="padding: 24px; margin: 16px 0;" open>
      <summary>Example</summary>
      <slot name="example" />
    </details>
  </div>
</template>
