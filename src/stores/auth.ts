import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie('auth_token', { maxAge: 3600 }), // Simpan token di cookie
    userId: null as number | null, // Simpan ID user
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        console.log('masd')
        const response = await $fetch<{ success: boolean; message: string; data: { error: number; id: number; token: string } }>(
          `${useRuntimeConfig().public.BACKEND_SERVICE}/v1/login`,
          {
            method: 'POST',
            body: { email, password },
          }
        )

        if (response.success) {
          this.token = response.data.token
          this.userId = response.data.id
          return true
        }

        return false
      } catch (error) {
        console.error('Login failed', error)
        return false
      }
    },

    logout() {
      this.token = null // Hapus token dari cookie
      this.userId = null // Reset ID user
      navigateTo('/login') // Redirect ke halaman login
    },
  },
})
