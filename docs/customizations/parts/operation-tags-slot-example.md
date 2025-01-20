<script setup lang="ts">
import { DEFAULT_OPERATION_SLOTS, useTheme } from 'vitepress-openapi/client'

useTheme({
    operation: {
      slots: [
        ...DEFAULT_OPERATION_SLOTS,
        'tags',
      ],
    },
})
</script>

<OASpec />
