<script setup lang="ts">
import { useData } from 'vitepress'
import { DEFAULT_OPERATION_SLOTS, useTheme } from 'vitepress-openapi/client'

const { isDark } = useData()

useTheme({
    operation: {
      slots: [
        ...DEFAULT_OPERATION_SLOTS,
        'tags',
      ],
    },
})
</script>

<OASpec :isDark="isDark" />
