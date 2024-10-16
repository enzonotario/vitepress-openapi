<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()

async function confetti() {
  (await import('https://esm.sh/canvas-confetti')).default()
}
</script>

<OAOperation operationId="getAllArtists" :isDark="isDark">

<template #description="description">

#### Custom description slot

All slots *can* contain ~~tons of text~~ **Markdown**. [If GitHub supports the syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), chances are we’re supporting it, too. You can even create [internal links to reference endpoints](#responses).

You can also include custom Vue components or HTML elements:

<button @click="confetti()" class="p-2 bg-muted rounded" aria-label="Trigger celebration confetti">:tada: Celebrate :tada:</button>

</template>

</OAOperation>
