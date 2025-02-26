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

  async doPostDetail(url, body = {}) {
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
      console.log(`[POS123123 URL:`, fullUrl)
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

  async doPostExcel(url, body, urlParam) {
    try {
      const fullUrl = `${this.apiBase}/${url}/${urlParam}`
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

  async doUpdate(url, body) {
    try {
      const fullUrl = `${this.apiBase}/${url}`
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

  async doDelete(url, body = {}) {
    try {
      const fullUrl = `${this.apiBase}/${url}`
      console.log(`[DELETE] Request URL:`, fullUrl)
      console.log(`[DELETE] Request Body:`, body)
  
      const response = await ofetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) // Kirim body sebagai JSON jika diperlukan
      })
  
      console.log(`[DELETE] Response:`, response)
      return response
    } catch (error) {
      console.error(`[DELETE] Error:`, error)
      throw error
    }
  }
  
  
  
}

export default new Api()
