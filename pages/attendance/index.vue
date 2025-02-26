<template>
    <p v-if="isLoading">
        Loading...</p>
    <v-container v-else>
        <h2>Daftar Kehadiran</h2>
        <br>
        <v-row no-gutters class="mb-2">
            <v-col cols="3" class="pa-2">
                <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
            </v-col>
            <v-col cols="3" class="pa-2">
                <v-select v-model="selectedLocation" label="Pilih Lokasi" :items="locations" clearable></v-select>
            </v-col>
            <v-col cols="2" class="pa-5">
                <v-btn color="primary" @click="submitForm">Cari</v-btn>
            </v-col>
    
            <v-spacer></v-spacer>
    
            <v-col cols="auto" class="pa-2 d-flex">
                <BaseDialog v-model="isAddAttendanceOpen" title="Add Attendance" buttonText="Add Attendance" buttonColor="primary" buttonVariant="tonal" @closed="isAddAttendanceOpen = false">
                    <h2>Form Kehadiran</h2>
                    <br>
                    <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="addAttendance" />
                </BaseDialog>
    
                <BaseDialog v-model="isDialogExporOpen" title="Ekspor Absensi" buttonText="Ekspor" buttonColor="primary" buttonVariant="tonal" @closed="isDialogExporOpen = false">
                    <h2>Expor </h2>
                    <br>
                    <BaseForm :fields="formFieldsExpor" v-model="formDataExpor" @submit="submitFormExpor" />
                </BaseDialog>
    
    
                <!-- <v-btn color="primary" class="mr-2" @click="fetchAttendances">Add</v-btn> -->
                <!-- <v-btn color="primary" @click="fetchAttendances">Export</v-btn> -->
            </v-col>
        </v-row>
    
    
        <v-select v-model="perPage" :items="[1, 10, 50]" hide-details dense class="perpage-select">
        </v-select>
    
        <!-- Tabel Kehadiran -->
        <v-table>
            <thead>
                <tr>
                    <th>NIK</th>
                    <th>Nama</th>
                    <th>Lokasi</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    
                <tr v-for="item in attendances" :key="item.id">
                    <td>{{ item.taxpayer.nik }}</td>
                    <td>{{ item.taxpayer.name }}</td>
                    <td>{{ item.project.project_name }}</td>
                    <td>
                        <v-btn color="primary" @click="showDetail(item.taxpayer.id)">Show</v-btn>
                        <v-btn color="primary" @click="update(item.taxpayer.id)">Update</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    
        <v-pagination v-model="currentPage" :length="totalPages" @update:modelValue="fetchAttendances"></v-pagination>
    
    </v-container>
</template>

<script setup>
import BaseDialog from "../../src/components/BaseDialog";
import BaseForm from "../../src/components/BaseForm";

import { onMounted, ref, computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import attendanceData from "../attendance_january_2025.js";

import { useAttendanceStore } from '../src/stores/attendanceStore'
import { useLoading } from '../src/composables/useLoading'

const router = useRouter();
const { isLoading, setLoading } = useLoading()
const attendanceStore = useAttendanceStore();
const searchNIK = ref("");
const selectedLocation = ref(null);
const perPage = ref(10);
const currentPage = ref(1);
const locations = ["CV Mulyani Tbk", "vbi", "sumarecon bekasi"];
const attendances = ref([]);
const totalPages = computed(() => Math.ceil(totalRecords.value / perPage.value));
const totalRecords = ref(0); // Tambahkan total records


const payload = computed(() => ({
    nik: searchNIK.value,
    project_name: selectedLocation.value,
    per_page: perPage.value,
    page: currentPage.value,
}));

const fetchAttendances = async () => {
    console.log("Payload:", payload.value);

    const response = await attendanceStore.fetchAttendances(payload.value);
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

onMounted(() => {
    fetchAttendances();
});


// Watch perubahan perPage
watch(perPage, (newValue) => {
    console.log("Per Page changed:", newValue);
    console.log("Per Page changed:", newValue);
    fetchAttendances(); // Fetch data baru saat perPage berubah
});

const getStatusText = (status) => {
    const statusMap = {
        "1": "Hadir",
        "2": "Izin",
        "3": "Alpha"
    };
    return statusMap[status] || "Unknown";
};


const formData = computed(() => ({
    year: "",
    month: "",
    project_id: "",
    file: null,
}));


const formFieldsAdd = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: false },
    { label: "Project", model: "project_id", type: "select", items: ["VBI", "PJ Rahayu", "Sumarecon Bogor"], required: false },
    { label: "Upload File", model: "file", type: "file", required: false },
];

const formDataExpor = ref({
    tanggal: "",
    project: "",
});

const formFieldsExpor = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
    { label: "Project", model: "project", type: "select", items: ["CV Mulyani Tbk", "PJ Rahayu", "Sumarecon Bogor"], required: true },
];

const submitForm = (data) => {
    console.log("Data tersimpan:", data);
};

const submitFormExpor = async (item) => {
    console.log("Data tersimpan:", item);

    const config = useRuntimeConfig();
    const apiBase = config.public.BACKEND_SERVICE; // Ambil dari runtimeConfig
    const urls = `${apiBase}/v1/attendances/export/?pr=1&attd=${item.picker}`;
    console.log("Payload:", urls);
    window.open(urls, "_blank");

};


const selectedDetail = ref(null);
// Fungsi menampilkan detail menggunakan dialog
const isAddAttendanceOpen = ref(false);
const isDialogExporOpen = ref(false);


const addAttendance = async (item) => {

    // Pastikan file adalah objek File
    if (!(item.file instanceof File)) {
        console.error("File tidak valid!", item.file);
        return;
    }

    // Buat FormData untuk multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("year", year);
    formDataToSend.append("month", month);
    formDataToSend.append("file", item.file); // File harus objek File
    formDataToSend.append("project_id", 1); // Pastikan ID benar

    const response = await attendanceStore.addAttendance(formDataToSend);

    console.log("Payload:", formDataToSend);

    // const response = await attendanceStore.addAttendance(formDataToSend);
    console.log('dataaaa', item.picker)
};

// Fungsi navigasi ke halaman show berdasarkan ID
const showDetail = (id) => {
    router.push(`/attendance/${id}`);
};

const update = (id) => {
    router.push(`/attendance/update?id=${id}`);

};

// Fungsi kembali ke halaman utama absensi
const goBack = () => {
    router.push("/attendance");
};

// Hitung total kehadiran
const getTotalHadir = (kehadiran) => {
    return kehadiran.filter(k => k.status === "Hadir").length;
};
</script>



<style scoped>
.table-container {
    position: relative;
}

.perpage-container {
    position: absolute;
    top: -40px;
    right: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.perpage-select {
    width: 90px;
    font-size: 12px;
}
</style>