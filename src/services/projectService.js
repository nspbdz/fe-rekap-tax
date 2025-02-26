import api from '../api/api'

export default {

    async dropdownProject() {
        try {
          return await api.doPost('projects/dropdown' )
        } catch (error) {
          throw error
        }
    },
      
  async getProjects() {
    try {
      return await api.doGet('projects')
    } catch (error) {
      throw error
    }
  },

  async detailProject(payload) {
    try {
      return await api.doPostDetail('projects/detail', payload)
    } catch (error) {
      throw error
    }
  },

  async DatatableProjects(payload) {
    try {
      return await api.doPostDatatable('projects', payload)
    } catch (error) {
      throw error
    }
  },

  async createProject(payload) {
    try {
      return await api.doPost('projects/store', payload)
    } catch (error) {
      throw error
    }
  },

  async updateProject(payload) {
    try {
      return await api.doUpdate('projects/update', payload)
    } catch (error) {
      throw error
    }
  },

  async deleteProject(id) {
    try {
      return await api.doDelete(`projects/${id}`)
    } catch (error) {
      throw error
    }
  }
}
