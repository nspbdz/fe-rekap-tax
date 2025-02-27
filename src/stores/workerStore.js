import { defineStore } from 'pinia'
import workerService from '../services/workerService'

export const useWorkerStore = defineStore('worker', {
  state: () => ({
    workerData: {
      nik: "",
      project_id: "",
      // masa_pajak: "",
      // tahun_pajak: "",
      // id_tku_penerima_penghasilan: "",
      // status_ptkp: "",
      // fasilitas: "",
      // kode_objek_pajak: "",
      // penghasilan: "",
      // deemed: "",
      // tarif: "",
      // jenis_dok_referensi: "",
      // nomor_dok_referensi: "",
      // tanggal_dok_referensi: "",
      // id_tku_pemotong: "",
      // tanggal_pemotongan: "",
      // file: null,
    },
    workers: [],
    loading: false,
  }),

  getters: {
    items: (state) => state.workers,
    workerList: (state) => state.workers?.data || [],
  },

  actions: {
    
    setWorkerData(data) {
      this.workerData = { ...this.workerData, ...data };
    },
    resetWorkerData() {
      this.workerData = {};
    },

    // Fetch semua data worker
    async fetchWorkers(payload) {
      this.loading = true
      try {
        console.log('[Store] Fetching workers with payload:', payload)
        const response = await workerService.DatatableWorkers(payload)

        if (response?.data) {
          this.workers = response
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

    // Tambah worker baru
    async addWorkerStore(payload) {
      this.loading = true
      try {
        console.log('[Store] Adding worker:', payload)
        const response = await workerService.createWorker(payload)
        if (response?.data) {
          this.workers.push(response.data)
        }
        return response
      } catch (error) {
        console.error('[Store] Adding Error:', error)
      } finally {
        this.loading = false
      }
    },

    // Update worker
    async updateWorker(payload) {
      this.loading = true
      try {
        console.log('[Store] Updating worker:', payload)
        const response = await workerService.updateWorker(payload.id, payload)
        return response
      } catch (error) {
        console.error('[Store] Updating Error:', error)
      } finally {
        this.loading = false
      }
    },

    // Detail worker
    async detailWorker(id) {
      this.loading = true
      try {
        console.log('[Store] Getting worker detail for ID:', id)
        const response = await workerService.getWorkerDetail(id)
        return response
      } catch (error) {
        console.error('[Store] Detail Error:', error)
      } finally {
        this.loading = false
      }
    },

    // Hapus worker
    async deleteWorker(id) {
      this.loading = true
      try {
        console.log('[Store] Deleting worker:', id)
        await workerService.deleteWorker(id)
        this.workers = this.workers.filter(worker => worker.id !== id)
      } catch (error) {
        console.error('[Store] Deleting Error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
