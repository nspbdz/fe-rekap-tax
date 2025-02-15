import { defineStore } from 'pinia'
import fetchServices from '../services/fetchServices'
import { showFailedPopup } from '../utils/utils'

export const useFetchStore = defineStore('fetch', {
  state: () => ({
    items: '',
  }),

  getters: {
    getItems: (state) => state.items,
  },

  actions: {
    async fetchItems() {
      try {
        const res = await fetchServices.GetFetch()
        this.items = res
        return res
      } catch (error) {
        showFailedPopup({ msg: error.message })
        throw error
      }
    },
  },
})
