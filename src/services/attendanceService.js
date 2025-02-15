import api from '@/services/api'

export default {
  async getAttendances() {
    try {
      return await api.doGet('attendances')
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
