export default {
    async GetFetch() {
      const { $api } = useNuxtApp()
      return await $api.doGet('fetch-endpoint')
    },
  }
  