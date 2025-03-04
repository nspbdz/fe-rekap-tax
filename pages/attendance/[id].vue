<template>
    <v-container>
        <v-btn @click="$router.push('/attendance')" color="secondary">Kembali</v-btn>
        <br>
        <br>
        <h2>Detail Kehadiran</h2>
        <br>
    
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
        <v-card>
            <v-card-title>{{ dataWorker?.taxpayer.name }} (NIK: {{ dataWorker?.taxpayer.nik }})</v-card-title>
        </v-card>
    
        <!-- Menampilkan Data -->
        <v-card>
            <v-form v-if="filteredData">
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
                                    <v-radio v-if="record.status == 1" label="Hadir" value="1"></v-radio>
                                    <v-radio v-if="record.status == 2" label="Tidak Hadir" value="2"></v-radio>
                                    <v-radio v-if="record.status == 3" label="Izin" value="3"></v-radio>
                                </v-radio-group>
                            </td>
    
                        </tr>
                    </tbody>
                </v-table>
    
            </v-form>
    
            <v-alert v-else-if="isFiltered" type="error">Data tidak ditemukan untuk bulan & tahun ini.</v-alert>
        </v-card>
    
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import attendanceData from "../attendance_january_2025.js";
import { useAttendanceStore } from '../../src/stores/attendanceStore'

const route = useRoute();
const id = parseInt(route.params.id);

console.log('id', id)
const attendanceStore = useAttendanceStore();
const selectedMonth = ref(null);
const selectedYear = ref(null);
const filteredData = ref(null);
const isFiltered = ref(false);
const attendances = ref([]);
const dataWorker = ref(null);


const filterData = async () => {

    try {

        const payload = {
            month: selectedMonth.value,
            year: selectedYear.value,
            id: id,
        }
        console.log("patlod2312", payload.value);
        console.log("selectedMonth", selectedMonth.value);
        console.log("selectedYear", selectedYear.value);

        // selectedMonth.value || !selectedYear.value

        const response = await attendanceStore.detailAttendance(payload);
        console.log('responseresponseresponse', response);
        console.log('responseresponseresponsedata', response.data);

        if (!response.data || Object.keys(response.data).length === 0) {
            errorMessage.value = "Data tidak ditemukan untuk bulan & tahun ini!";
            showError.value = true; // Tampilkan popup
            isFiltered.value = false;
            return;
        }

        filteredData.value = response.data[0];
        console.log('filteredDatafilteredData', filteredData.value);
        isFiltered.value = true;
    } catch (error) {
        errorMessage.value = "Terjadi kesalahan saat mengambil data: " + error.message;
        showError.value = true; // Tampilkan popup
        isFiltered.value = false;
    }
};

const payloadShow = computed(() => ({
    id,
}));

onMounted(async () => {
    console.log('Sebelum fetch:', payloadShow.value); // Cek data sebelum fetch

    const response = await attendanceStore.showAttendances(payloadShow.value);

    if (response.data) {
        dataWorker.value = response.data; // Jangan redeklarasi, cukup update value

        console.log("Attendances updated321:", dataWorker.value);
        console.log("Attendances :", response);
    } else {
        console.warn("No data received from API");
    }
});

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
