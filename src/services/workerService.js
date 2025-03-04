import api from '../api/api' // Pastikan ini ada

export default {
  async getWorkers() {
    try {
      return await api.doGet('workers')
    } catch (error) {
      throw error
    }
  },

  async getWorkerDetail(payload) {
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
  
  async createWorker(payload) {
    try {
      return await api.doPostWorker('workers/store', payload)
    } catch (error) {
      throw error
    }
  },

  async exportAttendance(payload) {
    try {
      return await api.doPostExcel('workers', payload)
    } catch (error) {
      throw error
    }
  },

  async updateWorker(payload) {
    try {
      return await api.doPost('workers/update', payload)
    } catch (error) {
      throw error
    }
  },

  async nikCheck(payload) {
    try {
      return await api.doPost('workers/check-nik', payload)
    } catch (error) {
      throw error
    }
  },


}
