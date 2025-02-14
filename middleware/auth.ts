import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '../src/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  
  if (!auth.token && to.path !== '/login') {
    return navigateTo('/login')
  }
})
