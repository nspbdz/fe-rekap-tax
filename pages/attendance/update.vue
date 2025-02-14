<template>
  <v-container>
    <v-btn @click="$router.push('/attendance')" color="secondary">Kembali</v-btn>
    <h2>Update Kehadiran</h2>

    <!-- Filter Bulan & Tahun -->
    <v-form @submit.prevent="filterData">
      <v-row>
        <v-col cols="4">
          <v-select v-model="selectedMonth" :items="months" label="Pilih Bulan" required></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="selectedYear" :items="years" label="Pilih Tahun" required></v-select>
        </v-col>
        <v-col cols="4">
          <v-btn type="submit" color="primary">Tampilkan Data</v-btn>
        </v-col>
      </v-row>
    </v-form>

  <!-- Menampilkan Data -->
  <v-card >
      <v-card-title>{{ dataWorker.nama }} (NIK: {{ dataWorker.nik }})</v-card-title>
  </v-card>
 
   
  <v-card >
    <v-form v-if="filteredData" @submit.prevent="submitData">
    <v-table>
      <thead>
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Status Kehadiran</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in filteredData.kehadiran" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ record.tanggal }}</td>
          <td>
            <v-radio-group v-model="record.status" inline>
              <v-radio label="Hadir" value="Hadir"></v-radio>
              <v-radio label="Tidak Hadir" value="Tidak Hadir"></v-radio>
              <v-radio label="Izin" value="Izin"></v-radio>
            </v-radio-group>
          </td>
        </tr>
      </tbody>
    </v-table>
  
      <v-btn type="submit" color="primary" class="mt-3">Submit</v-btn>
    </v-form>

    <v-alert v-else-if="isFiltered" type="error">Data tidak ditemukan untuk bulan & tahun ini.</v-alert>
    </v-card>

    

  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import attendanceData from "../attendance_january_2025.js";

const route = useRoute();
const id = parseInt(route.query.id);
console.log('id', id)
const selectedMonth = ref(null);
const selectedYear = ref(null);
const filteredData = ref(null);
const isFiltered = ref(false);

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

const years = ["2024", "2025"];
const dataWorker = attendanceData.find(item => item.id === id);
console.log('dataWorker', dataWorker)
// Opsi status kehadiran
const attendanceStatuses = ["Hadir", "Tidak Hadir", "Izin"];

// Fungsi untuk memfilter data berdasarkan bulan & tahun
const filterData = () => {
  console.log('masukkk')
  console.log('id', id)
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

const submitData = () => {
  console.log('masukkk')
  console.log('id', id)


  const formattedData = filteredData.value.kehadiran.map(record => ({
    nik: filteredData.value.nik,  // Ambil NIK dari filteredData
    tanggal: record.tanggal,      // Ambil tanggal kehadiran
    status: record.status || "Hadir",  // Default kehadiran jika kosong
  }));
  console.log("Data yang disimpan:", formattedData);


  isFiltered.value = true;
};
</script>
