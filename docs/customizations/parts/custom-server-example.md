<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useTheme } from 'vitepress-openapi/client'

onBeforeMount(() => {
    useTheme({
        server: {
            allowCustomServer: true,
        },
    })
})
</script>

<OASpec />
