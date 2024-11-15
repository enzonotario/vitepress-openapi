<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'

const { isDark } = useData()

useTheme({
    operation: {
        badges: ['deprecated', 'operationId'],
    },
})
</script>

<OASpec :isDark="isDark" />
