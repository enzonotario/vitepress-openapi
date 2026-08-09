import { ref, watch } from 'vue'
import {
  getDefaultPlaygroundSpecUrl,
  getPlaygroundSpecOptions,
  getPlaygroundSpecSearch,
  resolvePlaygroundSpecUrl,
} from '../lib/playgroundSpecs'

const specs = getPlaygroundSpecOptions()
const defaultSpecUrl = getDefaultPlaygroundSpecUrl(specs)
const selectedSpecUrl = ref(defaultSpecUrl)

let isLocationSyncEnabled = false

function syncSelectedSpecUrlFromLocation() {
  if (typeof window === 'undefined') {
    return
  }

  selectedSpecUrl.value = resolvePlaygroundSpecUrl({
    search: window.location.search,
    specs,
    defaultSpecUrl,
  })
}

function enableLocationSync() {
  if (typeof window === 'undefined' || isLocationSyncEnabled) {
    return
  }

  isLocationSyncEnabled = true

  syncSelectedSpecUrlFromLocation()
  window.addEventListener('popstate', syncSelectedSpecUrlFromLocation)

  watch(selectedSpecUrl, (value) => {
    const nextSearch = getPlaygroundSpecSearch({
      currentSearch: window.location.search,
      selectedSpecUrl: value,
      defaultSpecUrl,
    })

    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (nextUrl !== currentUrl) {
      window.history.replaceState({}, '', nextUrl)
    }
  })
}

export function usePlaygroundSpecSelection() {
  enableLocationSync()

  return {
    specs,
    defaultSpecUrl,
    selectedSpecUrl,
  }
}
