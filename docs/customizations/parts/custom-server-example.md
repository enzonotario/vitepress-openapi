<script setup>
import { useTheme } from 'vitepress-openapi/client'

useTheme({
    server: {
        allowCustomServer: true,
    },
})
</script>

<OASpec />
