<template>
    <p v-if="isLoading">
        Loading...</p>
    <v-container v-else>
        <h2>Daftar Kehadiran</h2>
        <br>
        <v-row no-gutters class="mb-2">
            <v-col cols="3" class="pa-2">
                <BaseForm :fields="formFieldsSearch" v-model="formDataSearch" />
                <!-- <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field> -->
            </v-col>
    
            <v-col cols="3" class="pa-2">
                <v-select v-model="selectedLocation" label="Pilih Lokasi" :items="locationsDropdown" item-title="name" item-value="id" clearable>
                </v-select>
            </v-col>
            <v-col cols="2" class="pa-5">
                <v-btn color="primary" @click="submitForm">Cari</v-btn>
            </v-col>
    
            <v-spacer></v-spacer>
    
            <v-col cols="auto" class="pa-2 d-flex">
                <BaseDialog v-model="isAddAttendanceOpen" title="Add Attendance" buttonText="Add Attendance" buttonColor="primary" buttonVariant="tonal" @closed="isAddAttendanceOpen = false">
                    <h2>Form Kehadiran</h2>
                    <a href="/sample_attendance.xlsx" download="sample_attendance.xlsx">
                                                    <button>Download Example</button>
                                                    </a>
                    <br>

                    <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="addAttendance" />
                </BaseDialog>
    
                <BaseDialog v-model="isDialogExporOpen" title="Ekspor Absensi" buttonText="Ekspor" buttonColor="primary" buttonVariant="tonal" @closed="isDialogExporOpen = false">
                    <h2>Expor </h2>
                    <br>
                    <BaseForm :fields="formFieldsExpor" v-model="formDataExpor" @submit="submitFormExpor" />
                </BaseDialog>
    
    
            </v-col>
        </v-row>
    
    
        <v-select v-model="perPage" :items="[1, 10, 50]" hide-details dense class="perpage-select">
        </v-select>
    
        <!-- Tabel Kehadiran -->
        <v-table>
            <thead>
                <tr>
                    <!-- <th>NIK</th> -->
                    <th>Tanggal</th>
                    <th>Lokasi</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    
                <tr v-for="item in attendances" :key="item.id">
                    <!-- <td>{{ item.taxpayer.nik }}</td> -->
                    <td>{{ item.attendance_date }}</td>
                    <td>{{ item.project?.project_name || "-" }}</td>

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
import { ofetch } from 'ofetch'

import { useAttendanceStore } from '../src/stores/attendanceStore'
import { useProjectStore } from '../src/stores/projectStore'
import { useLoading } from '../src/composables/useLoading'
import axios from 'axios'

const router = useRouter();
const { isLoading, setLoading } = useLoading()
const attendanceStore = useAttendanceStore();
const projectStore = useProjectStore();
const searchNIK = ref("");
const selectedLocation = ref(null);
const perPage = ref(10);
const currentPage = ref(1);
const attendances = ref([]);
const totalPages = computed(() => Math.ceil(totalRecords.value / perPage.value));
const totalRecords = ref(0); // Tambahkan total records
const projectLocation = ref("");
const locations = ref([])
const locationsDropdown = ref([])


const fetchLocations = async () => {
    try {
        const response = await projectStore.fetchProjectLocation(payload.value);
        console.log("location123", response.data);

        locationsDropdown.value = response.data.map(loc => ({
            id: loc.id,
            name: loc.project_name
        }));
        console.log("location123321", locationsDropdown.value);

       const itemsss =  locationsDropdown.value.map(loc => ({id: loc.id,name: loc.name }) ) // Ambil nama lokasi dari API
       console.log("itemsss", itemsss);

        locations.value = response.data; // Simpan hasil response ke variabel projects
    } catch (error) {
        console.error('Error fetching locations:', error)
    }
}

const payload = computed(() => ({
    // nik: searchNIK.value,
    year: "",
    month: "",
    project_id: selectedLocation.value,
    per_page: perPage.value,
    page: currentPage.value,
}));

const fetchAttendances = async () => {
    // console.log("Payload:", payload.value);

    const response = await attendanceStore.fetchAttendances(payload.value);
    // console.log("Attendances updated:12312312", response);

    if (response.data) {
        totalRecords.value = response.total; // Pastikan API mengembalikan total data
        attendances.value = response.data; // Simpan hasil response ke variabel attendances
        // console.log("Attendances updated321:", attendances.value);
        // console.log("Attendances :", response);
    } else {
        console.warn("No data received from API");
    }
};

onMounted(() => {
    fetchAttendances();
    fetchLocations();
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


const formData= ref({
    year: "",
    month: "",
    project_id: "",
    file: null,
});

const formDataSearch= ref({
    year: "",
    month: "",
    project_id: "",
});




const formFieldsSearch = computed(() => [
    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: false },
]);


const formFieldsAdd = computed(() => [
    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: false },
    {
        label: "Project",
        model: "project_id",
        type: "select",
        itemTitle: "name",
        itemValue: "id",
        items :  locationsDropdown.value.map(loc => ({id:loc.id,name:loc.name }) ), // Ambil nama lokasi dari API
        // items: locations.value.map(loc => loc.project_name), // Ambil nama lokasi dari API
        required: false
    },
    { label: "Upload File", model: "file", type: "file", required: false },
]);


const formDataExpor = ref({
    tanggal: "",
    project: "",
});

const formFieldsExpor = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
    { label: "Project", model: "project", type: "select", items: ["CV Mulyani Tbk", "PJ Rahayu", "Sumarecon Bogor"], required: true },
];

const submitForm = (data) => {
    

    payload.value.year =  formDataSearch.value.picker.split("-")[0] 
     payload.value.month = formDataSearch.value.picker.split("-")[1] 
    console.log('formData.valueformData.value', formData.value)
    
    fetchAttendances();
    console.log("Data tersimpan:", data);
    console.log('formDataSearchformDataSearch', formDataSearch.value)
    

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


     formData.value.year =  item.picker.split("-")[0] 
     formData.value.month = item.picker.split("-")[1] 
        console.log('yyy', formData.value)

        const formDataToSend = new FormData();

        for (const key in formData.value) {
            if (formData.value[key] !== null && formData.value[key] !== undefined) {
                formDataToSend.append(key, formData.value[key]);
            }
        }

        try {
            const response = await axios.post(
                'http://localhost:9010/api/v1/attendances/store-excel', 
                formDataToSend, 
                {
                headers: {
                    'Accept': 'application/json'
                    // Jangan set 'Content-Type' secara manual karena browser akan mengaturnya untuk FormData
                }
                }
            );
            console.log('Response:', response.data);
            alert('Upload berhasil!');
            } catch (error) {
            console.error('Upload error:', error.response?.data);
            alert(error.response?.data.message);
        }

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