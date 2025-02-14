<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')">Home</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="(item, index) in menuItems" :key="index" :to="item.route">
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(true);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", route: "/" },
  { title: "Absensi", icon: "mdi-calendar-check", route: "/absensi" },
  { title: "Tempat Proyek", icon: "mdi-office-building", route: "/projects" },
  { title: "Logout", icon: "mdi-logout", route: "/logout" },
]);
</script>
