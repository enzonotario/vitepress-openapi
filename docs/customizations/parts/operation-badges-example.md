<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'
import spec from '../public/openapi.json'

const { isDark } = useData()

useTheme({
    operation: {
        badges: ['deprecated', 'operationId'],
    },
})
</script>

<OAOperation :spec="spec" operationId="getAllArtists" :isDark="isDark" />
