<script setup lang="ts">
import { useTheme } from 'vitepress-openapi/client'

useTheme({
    operation: {
        badges: ['deprecated', 'operationId'],
    },
})
</script>

<OASpec />
