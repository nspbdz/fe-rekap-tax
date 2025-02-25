<template>
  <v-container>

    <v-dialog v-model="showError" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-red">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="showError = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      <v-card-title>{{ dataWorker?.taxpayer.name }} (NIK: {{ dataWorker?.taxpayer.nik }})</v-card-title>
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
        <tr v-for="(record, index) in filteredData[0].kehadiran" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ record.tanggal }}</td>
          <td>
            <v-radio-group v-model="record.status" inline>
              <v-radio label="Hadir" value="1"></v-radio>
              <v-radio label="Tidak Hadir" value="2"></v-radio>
              <v-radio label="Izin" value="3"></v-radio>
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
import { useAttendanceStore } from '../src/stores/attendanceStore'
import attendanceData from "../attendance_january_2025.js";
import { onMounted } from 'vue'

const store = useAttendanceStore()
const route = useRoute();
const id = parseInt(route.query.id);
console.log('id', id)
const selectedMonth = ref(null);
const selectedYear = ref(null);
const filteredData = ref(null);
const isFiltered = ref(false);
const dataWorker = ref(null);
const showError = ref(false); // Untuk menampilkan popup error
const errorMessage = ref(""); // Menyimpan pesan error


onMounted(async () => {
  console.log('Sebelum fetch:', store.attendanceList); // Cek data sebelum fetch

  if (!store.attendanceList.length) {
    await store.fetchAttendances({ page: 1 }); // Fetch ulang jika kosong
    console.log('Data setelah fetch:', store.attendanceList);
  }

  // Pastikan ID valid sebelum mengambil data
  if (id !== undefined && store.attendanceList[id]) {
    dataWorker.value = store.attendanceList[id]; // Jangan redeklarasi, cukup update value
    console.log('Data Worker:', dataWorker.value);
  } else {
    console.warn('Data tidak ditemukan untuk ID:', id);
    dataWorker.value = 'Data tidak ditemukan'; // Gunakan string sebagai fallback
  }
});


console.log('1111233212312:', dataWorker) // Output taxpayer dari id 1

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
// const dataWorker = attendanceData.find(item => item.id === id);
console.log('dataWorker', dataWorker)
// Opsi status kehadiran
const attendanceStatuses = ["Hadir", "Tidak Hadir", "Izin"];

// Fungsi untuk memfilter data berdasarkan bulan & tahun

const payload = computed(() => ({
  month: selectedMonth.value,
  year: selectedYear.value,
  id,
  project_id: dataWorker.value.project_id,
}));


const filterData = async () => {
  try {
    const response = await store.detailAttendance(payload.value);
    console.log('responseresponseresponse', response);

    if (!response.data || Object.keys(response.data).length === 0) {
      errorMessage.value = "Data tidak ditemukan untuk bulan & tahun ini!";
      showError.value = true; // Tampilkan popup
      isFiltered.value = false;
      return;
    }

    filteredData.value = response.data;
    isFiltered.value = true;
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan saat mengambil data: " + error.message;
    showError.value = true; // Tampilkan popup
    isFiltered.value = false;
  }
};

const submitData = async () => {

  console.log('masukkk');
  console.log('id', id);

  if (!filteredData.value || !filteredData.value[0]?.kehadiran) {
    console.error("Data tidak ditemukan atau kosong!", filteredData.value);
    return;
  }

  const formattedData = filteredData.value[0].kehadiran.map(record => ({
    taxpayer_id: filteredData.value[0].id,  // Ambil NIK dari filteredData
    attendance_date: record.tanggal,         // Ambil tanggal kehadiran
    status: record.status || "Hadir", // Default kehadiran jika kosong
  }));

  const response = await store.updateAttendance({ data: formattedData });
  console.log('responseresponseresponse', response)

};


</script>
