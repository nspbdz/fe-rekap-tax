import api from '../api/api' // Pastikan ini ada

export default {
  async getWorkers() {
    try {
      return await api.doGet('workers')
    } catch (error) {
      throw error
    }
  },

  async detailAttendance(payload) {
    try {
      return await api.doPostDetail('workers/detail', payload)
    } catch (error) {
      throw error
    }
  },

  async DatatableWorkers(payload) {
    try {
      return await api.doPostDatatable('workers', payload) // Tambahkan payload
    } catch (error) {
      throw error
    }
  },
  
  async createAttendance(payload) {
    try {
      return await api.doPostExcel('workers', payload)
    } catch (error) {
      throw error
    }
  },

  async exportAttendance(payload, urlParam) {
    try {
      console.log('aasd', urlParam)
      return await api.doPostExcel('workers', payload, urlParam)
    } catch (error) {
      throw error
    }
  },

  async updateAttendance(payload) {
    try {
      return await api.doUpdate('workers/update', payload)
    } catch (error) {
      throw error
    }
  },


}
