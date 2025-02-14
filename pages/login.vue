<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card width="400" class="pa-5">
        <v-card-title class="text-center text-h5">Login</v-card-title>
  
        <v-form @submit.prevent="handleLogin">
          <v-text-field v-model="email" label="Email" type="email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
  
          <v-btn :loading="loading" block color="primary" type="submit">Login</v-btn>
  
          <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>
        </v-form>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { useAuthStore } from '../src/stores/auth'

    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
  
  async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    navigateTo('/dashboard') // Arahkan ke halaman lain setelah login
  } else {
    alert('Login gagal, cek kembali email/password!')
  }
}
  </script>
  