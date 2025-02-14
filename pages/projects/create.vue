lokasilokasi<template>
    <v-container>
      <h2>Tambah Proyek</h2>
  
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="nama" label="Nama Proyek" required></v-text-field>
        <v-text-field v-model="lokasi" label="Lokasi" required></v-text-field>
  
        <v-btn type="submit" color="primary">Submit</v-btn>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const nama = ref("");
  const lokasi = ref("");
  const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];
  
  // Simpan data baru (dummy, belum ke backend)
  const submitForm = () => {
    alert(`Proyek ${nama.value} di ${lokasi.value} berhasil ditambahkan!`);
    goBack();
  };
  
  // Kembali ke halaman Index
  const goBack = () => {
    router.push("/projects");
  };
  </script>
  