<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { DEFAULT_OPERATION_SLOTS, useTheme } from 'vitepress-openapi/client'

onBeforeMount(() => {
    useTheme({
        operation: {
            slots: [
                ...DEFAULT_OPERATION_SLOTS,
                'tags',
            ],
        },
    })
})
</script>

<OASpec />
