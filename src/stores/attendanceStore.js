import { defineStore } from 'pinia'
import attendanceService from '../services/attendanceService'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendances: [],
    loading: false
  }),

  getters: {
    items: (state) => state.attendances,
  },

  actions: {
    async fetchAttendances() {
      this.loading = true
      try {
        console.log('[Store] Fetching attendances...')
        // this.items = await attendanceService.GetFetch()
        const res = await attendanceService.getAttendances();
        console.log('123', res.data)
        // this.attendances = res.data;
        this.attendances = res.data;
        return res;
      } catch (error) {
        console.error('[Store] Fetching Error:', error)
      } finally {
        this.loading = false
      }
    },

    async addAttendance(payload) {
      this.loading = true
      try {
        console.log('[Store] Adding attendance:', payload)
        const response = await attendanceService.createAttendance(payload)
        this.items.push(response)
      } catch (error) {
        console.error('[Store] Adding Error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
