<template>
  <v-container>
    <v-btn @click="$router.push('/attendance')" color="secondary">Kembali</v-btn>
    <h2>Detail Kehadiran</h2>

    <!-- Filter Bulan & Tahun -->
    <v-form @submit.prevent="filterData">
      <v-row>
        <v-col cols="6">
          <v-select v-model="selectedMonth" :items="months" label="Pilih Bulan" required></v-select>
        </v-col>
        <v-col cols="6">
          <v-select v-model="selectedYear" :items="years" label="Pilih Tahun" required></v-select>
        </v-col>
      </v-row>
      <v-btn type="submit" color="primary">Tampilkan Data</v-btn>
    </v-form>

    <!-- Menampilkan Data -->
    <v-card v-if="filteredData">
      <v-card-title>{{ filteredData.nama }} (NIK: {{ filteredData.nik }})</v-card-title>
      <v-list>
        <v-list-item v-for="(record, index) in filteredData.kehadiran" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ record.tanggal }}</v-list-item-title>
            <v-list-item-subtitle>Status: {{ record.status }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-alert v-else-if="isFiltered" type="error">Data tidak ditemukan untuk bulan & tahun ini.</v-alert>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import attendanceData from "../attendance_january_2025.js";

const route = useRoute();
const id = parseInt(route.params.id);
console.log('id', id)
const selectedMonth = ref(null);
const selectedYear = ref(null);
const filteredData = ref(null);
const isFiltered = ref(false);

const filterData = async () => {
  console.log("Payload:", payload.value);

  const payload = {
    month :selectedMonth,
    year : selectedYear,
    id: id,
  }

  // selectedMonth.value || !selectedYear.value

  const response = await attendanceStore.showAttendance(payload.value);
  console.log("Attendances updated:12312312", response);
  
  if (response.data.length > 0) {
    totalRecords.value = response.total; // Pastikan API mengembalikan total data
    attendances.value = response.data; // Simpan hasil response ke variabel attendances
    console.log("Attendances updated321:", attendances.value);
    console.log("Attendances :", response);
  } else {
    console.warn("No data received from API");
  }
};

// Opsi bulan dan tahun
const months = [
  { title: "Januari", value: "01" },
  { title: "Februari", value: "02" },
  { title: "Maret", value: "03" },
  { title: "April", value: "04" },
  { title: "Mei", value: "05" },
  { title: "Juni", value: "06" },
  { title: "Juli", value: "07" },
  { title: "Agustus", value: "08" },
  { title: "September", value: "09" },
  { title: "Oktober", value: "10" },
  { title: "November", value: "11" },
  { title: "Desember", value: "12" },
];

const years = ["2024", "2025", "2026"];

// Fungsi untuk memfilter data berdasarkan bulan & tahun
const filterDataOld = () => {
  console.log('masukkk')
  if (!selectedMonth.value || !selectedYear.value) return;
  const data = attendanceData.find(item => item.id === id);

  if (data) {
    // Filter kehadiran berdasarkan bulan & tahun
    const filteredKehadiran = data.kehadiran.filter(record => {
      return record.tanggal.startsWith(`${selectedYear.value}-${selectedMonth.value}`);
    });

    // Jika ada data, simpan ke `filteredData`, jika tidak, kosongkan
    filteredData.value = filteredKehadiran.length ? { ...data, kehadiran: filteredKehadiran } : null;
  } else {
    filteredData.value = null;
  }

  isFiltered.value = true;
};
</script>
