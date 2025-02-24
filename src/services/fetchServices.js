import api from '../api/api' // Pastikan ini ada

export default {
  async GetFetch() {
    try {
      console.log('[Service] Fetching attendances...')
      const response = await api.post('attendances')
      console.log('[Service] Response:', response)
      return response
    } catch (error) {
      console.error('[Service] Fetching Error:', error)
      throw error
    }
  },

  async createAttendance(payload) {
    try {
      console.log('[Service] Creating attendance:', payload)
      const response = await api.doPost('attendances', payload)
      console.log('[Service] Attendance Created:', response)
      return response
    } catch (error) {
      console.error('[Service] Creating Error:', error)
      throw error
    }
  }
}
