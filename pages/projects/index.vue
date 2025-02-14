<template>
  <v-container>
    <h2>Daftar Proyek</h2>

    <!-- Tombol Create -->
    <v-btn color="primary" @click="goToCreate">Tambah Proyek</v-btn>

    <!-- Tabel Proyek -->
    <v-table class="mt-4">
      <thead>
        <tr>
          <th>Nama Proyek</th>
          <th>Lokasi</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in projects" :key="index">
          <td>{{ project.nama }}</td>
          <td>{{ project.lokasi }}</td>
          <td>
            <v-btn color="warning" @click="goToUpdate(project.id)">Update</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import projects from "../dataProjects.js";

const router = useRouter();

// Navigasi ke halaman Create
const goToCreate = () => {
  router.push("/projects/create");
};

// Navigasi ke halaman Update
const goToUpdate = (id) => {
  router.push(`/projects/update?id=${id}`);
};
</script>
