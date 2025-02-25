import { useRuntimeConfig } from '#app'
import { ofetch } from 'ofetch'
import { PREFIX } from './apiUrl.js'

class Api {
  constructor() {
    this.config = useRuntimeConfig()
    this.apiBase = this.config.public.BACKEND_SERVICE + PREFIX
  }

  async doGet(url, params) {
    try {
      const fullUrl = `${this.apiBase}/${url}`
      console.log(`[GET] Request URL:`, fullUrl)
      const response = await ofetch(fullUrl, { method: 'GET', params })
      console.log(`[GET] Response:`, response)
      return response
    } catch (error) {
      console.error(`[GET] Error:`, error)
      throw error
    }
  }

  async doPostDatatable(url, body = {}) {
    try {
      const fullUrl = `${this.apiBase}/${url}`
      console.log(`[POST] Request URL:`, fullUrl)
      console.log(`[POST] Request Body:`, body)
  
      const response = await ofetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) // Ubah body menjadi JSON
      })
  
      console.log(`[POST] Response:`, response)
      return response
    } catch (error) {
      console.error(`[POST] Error:`, error)
      throw error
    }
  }

  async doPost(url, body = {}) {
    try {
      const fullUrl = `${this.apiBase}/${url}`
      console.log(`[POST] Request URL:`, fullUrl)
      console.log(`[POST] Request Body:`, body)
  
      const response = await ofetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) // Ubah body menjadi JSON
      })
  
      console.log(`[POST] Response:`, response)
      return response
    } catch (error) {
      console.error(`[POST] Error:`, error)
      throw error
    }
  }

  async doPostExcel(url, body) {
    try {
      const fullUrl = `${this.apiBase}/${url}/store-excel`
      console.log(`[POST] Request URL:`, fullUrl)
      console.log(`Excel payload:`, body)
  
      const response = await ofetch(fullUrl, {
        method: 'POST',
        body: body, // Kirim langsung FormData
      })
  
      console.log(`[POST] Response:`, response)
      return response
    } catch (error) {
      console.error(`[POST] Error:`, error)
      throw error
    }
  }
  
  
}

export default new Api()
