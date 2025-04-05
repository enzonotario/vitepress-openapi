<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useTheme } from 'vitepress-openapi/client'

onBeforeMount(() => {
    useTheme({
        operation: {
            badges: ['deprecated', 'operationId'],
        },
    })
})
</script>

<OASpec />
