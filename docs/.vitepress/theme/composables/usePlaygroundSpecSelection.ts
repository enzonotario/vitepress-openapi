import { ref } from 'vue'
import {
  getDefaultPlaygroundSpecUrl,
  getPlaygroundSpecOptions,
} from '../lib/playgroundSpecs'

const specs = getPlaygroundSpecOptions()
const selectedSpecUrl = ref(getDefaultPlaygroundSpecUrl(specs))

export function usePlaygroundSpecSelection() {
  return {
    specs,
    selectedSpecUrl,
  }
}
