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
    async fetchAttendances(payload) {
      this.loading = true
      try {
        console.log('[Store] Fetching attendances with payload:', payload)
        const response = await attendanceService.DatatableAttendances(payload)
  
        if (response?.data) {
          this.attendances = response
          return response  // Tambahkan return agar bisa digunakan di FE
        } else {
          console.warn('[Store] API response does not contain data:', response)
          return [] // Kembalikan array kosong jika tidak ada data
        }
  
      } catch (error) {
        console.error('[Store] Fetching Error:', error)
        return [] // Kembalikan array kosong jika terjadi error
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
