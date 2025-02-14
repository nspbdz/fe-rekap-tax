<template>
    <v-container>
      <h2>Update Proyek</h2>
  
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="nama" label="Nama Proyek" required></v-text-field>
        <v-select v-model="lokasi" label="Lokasi" :items="lokasiOptions" required></v-select>
  
        <v-btn type="submit" color="primary">Update</v-btn>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import projects from "../dataProjects.js";


  
  const router = useRouter();
  const route = useRoute();
  const nama = ref("");
  const lokasi = ref("");
  const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];
  const id = ref(null);
  
  // Load data proyek berdasarkan ID
  onMounted(() => {
    id.value = parseInt(route.query.id);
    const project = projects.find(p => p.id === id.value);
    if (project) {
      nama.value = project.nama;
      lokasi.value = project.lokasi;
    } else {
      alert("Data proyek tidak ditemukan");
      goBack();
    }
  });
  
  // Update data (dummy, belum ke backend)
  const submitForm = () => {
    alert(`Proyek ${nama.value} telah diperbarui!`);
    goBack();
  };
  
  // Kembali ke halaman Index
  const goBack = () => {
    router.push("/projects");
  };
  </script>
  