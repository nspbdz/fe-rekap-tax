import api from '../api/api' // Pastikan ini ada

export default {
  async getAttendances() {
    try {
      return await api.doGet('attendances')
    } catch (error) {
      throw error
    }
  },

  async detailAttendance(payload) {
    try {
      return await api.doPostDetail('attendances/detail', payload)
    } catch (error) {
      throw error
    }
  },

  async DatatableAttendances(payload) {
    try {
      return await api.doPostDatatable('attendances', payload) // Tambahkan payload
    } catch (error) {
      throw error
    }
  },
  
  async createAttendance(payload) {
    try {
      return await api.doPostExcel('attendances', payload)
    } catch (error) {
      throw error
    }
  },

  async exportAttendance(payload, urlParam) {
    try {
      console.log('aasd', urlParam)
      return await api.doPostExcel('attendances', payload, urlParam)
    } catch (error) {
      throw error
    }
  },

  async updateAttendance(payload) {
    try {
      return await api.doUpdate('attendances/update', payload)
    } catch (error) {
      throw error
    }
  },


}
