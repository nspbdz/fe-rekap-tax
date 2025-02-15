import { ref } from 'vue'

const isLoading = ref(false)

export function useLoading() {
  return {
    isLoading,
    setLoading: (value) => (isLoading.value = value),
  }
}
