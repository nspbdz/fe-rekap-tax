import { defineStore } from 'pinia'
import attendanceService from '../services/attendanceService'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendances: [],
    loading: false
  }),

  getters: {
    items: (state) => state.attendances,
    attendanceList: (state) => state.attendances?.data || [] // Ambil hanya array data dari response
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
        // this.items.push(response)
      } catch (error) {
        console.error('[Store] Adding Error:', error)
      } finally {
        this.loading = false
      }
    },

    async detailAttendance(payload) {
      this.loading = true
      try {
        console.log('[Store] Adding attendance:', payload)
        const response = await attendanceService.detailAttendance(payload)
        // this.items.push(response)
      } catch (error) {
        console.error('[Store] Adding Error:', error)
      } finally {
        this.loading = false
      }
    },

    async exportAttendance(payload, urlParam) {
      this.loading = true
      try {
        const config = useRuntimeConfig();
        const apiBase = config.public.BACKEND_SERVICE; // Ambil dari runtimeConfig
        const url = `${apiBase}/attendances/export/?pr=1&attd=${item.picker}`;
        console.log('url', url)
        // window.open(url, "_blank");

        // console.log('[Store] export attendance:', urlParam)
        // const response = await attendanceService.exportAttendance(payload, urlParam)
        // this.items.push(response)
      } catch (error) {
        console.error('[Store] Adding Error:', error)
      } finally {
        this.loading = false
      }
    }


  }
})

