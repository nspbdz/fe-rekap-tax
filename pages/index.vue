

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else>Data: {{ fetchStore.getItems }}</p>

    <h1>Login Page</h1>

    <div v-if="!auth.token">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
    </div>

    <div v-else>
      <p>Welcome, {{ auth.user?.name }}</p>
      <button @click="auth.logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useFetchStore } from '../src/stores/fetchStore'
import { useLoading } from '../src/composables/useLoading'
import { useAuthStore } from "../src/stores/auth";
import { ref } from 'vue'

const fetchStore = useFetchStore()
const { isLoading, setLoading } = useLoading()

setLoading(true)

fetchStore.fetchItems().finally(() => {
  setLoading(false)
})

const auth = useAuthStore()
const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await auth.login(email.value, password.value)
  if (success) {
    alert('Login berhasil!')
  } else {
    alert('Login gagal, cek kembali email dan password')
  }
}
</script>