import api from '../api/api' // Pastikan ini ada

export default {
  async getAttendances() {
    try {
      return await api.doGet('attendances')
    } catch (error) {
      throw error
    }
  },

  async DatatableAttendances(payload) {
    try {
      return await api.doPost('attendances', payload) // Tambahkan payload
    } catch (error) {
      throw error
    }
  },
  
  async createAttendance(payload) {
    try {
      return await api.doPost('attendances', payload)
    } catch (error) {
      throw error
    }
  }
}
