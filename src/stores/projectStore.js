import { defineStore } from 'pinia'
import projectService from '../services/projectService'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false
  }),

  getters: {
    items: (state) => state.projects,
    data: (state) => state.projects,
    projectList: (state) => state.projects?.data || [] 
  },

  actions: {
    async fetchProjects(payload) {
      this.loading = true
      try {
        console.log('[Store] Fetching projects with payload:', payload)
        const response = await projectService.DatatableProjects(payload)

        if (response?.data) {
          this.projects = response
          return response
        } else {
          console.warn('[Store] API response does not contain data:', response)
          return []
        }
      } catch (error) {
        console.error('[Store] Fetching Error:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async addProject(payload) {
      this.loading = true
      try {
        console.log('[Store] Adding project:', payload)
        return await projectService.createProject(payload)
      } catch (error) {
        console.error('[Satore] Adding Error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateProject(payload) {
      this.loading = true
      try {
        console.log('[Store] Updating project:', payload)
        return await projectService.updateProject(payload)
      } catch (error) {
        console.error('[Store] Updating Error:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      try {
        console.log('[Store] Deleting project with ID:', id)
        return await projectService.deleteProject(id)
      } catch (error) {
        console.error('[Store] Deleting Error:', error)
      } finally {
        this.loading = false
      }
    },

    async detailProject(payload) {
      this.loading = true
      try {
        console.log('[Store] Fetching project detail:', payload)
        const response = await projectService.detailProject(payload)

        if (response?.data) {
          this.projects = response
          return response
        } else {
          console.warn('[Store] API response does not contain data:', response)
          return []
        }
      } catch (error) {
        console.error('[Store] Fetching Detail Error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
