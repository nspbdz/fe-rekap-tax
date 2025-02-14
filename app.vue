<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')">Home</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Tombol Logout jika sudah login -->
      <v-btn v-if="auth.token" @click="logout" color="red">
        <v-icon left>mdi-logout</v-icon> Logout
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="item.route"
          link
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useAuthStore } from "./src/stores/auth";
import { useRouter } from "vue-router";

// Inisialisasi store dan router
const auth = useAuthStore();
const router = useRouter();

// Redirect ke /login jika belum login
watchEffect(() => {
  if (!auth.token) {
    router.push("/login");
  }
});

// State untuk drawer
const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Data menu navigasi
const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", route: "/" },
  { title: "Pekerja", icon: "mdi-account-check", route: "/worker" },
  { title: "Absensi", icon: "mdi-calendar-check", route: "/attendance" },
  { title: "Tempat Proyek", icon: "mdi-office-building", route: "/projects" },
]);

// Fungsi logout
const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>
