import { PREFIX } from './apiUrl'

export default defineNuxtPlugin((nuxtApp) => {
  const $axios = useNuxtApp().$axios

  const api = {
    async doGet(url, params) {
      try {
        const res = await $axios.get(PREFIX + url, { params })
        return res.data
      } catch (error) {
        throw error
      }
    },

    async doPost(url, params) {
      try {
        const res = await $axios.post(PREFIX + url, params)
        return res.data
      } catch (error) {
        throw error
      }
    },
  }

  return {
    provide: {
      api,
    },
  }
})
