<template>
    <p v-if="isLoading"> Loading...</p>
    <v-container v-else>
    
        <v-dialog v-model="isDeleteDialogOpen" max-width="400px">
            <v-card>
                <v-card-title>Konfirmasi Hapus</v-card-title>
                <v-card-text>Apakah Anda yakin ingin menghapus proyek ini?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="isDeleteDialogOpen = false">Batal</v-btn>
                    <v-btn color="red" @click="handleDeleteConfirmed">Hapus</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    
        <BaseDialog v-model="isUpdateDialogOpen" title="Update Project" hideActivator @closed="isUpdateDialogOpen = false">
            <BaseForm :fields="formFieldsUpdate" v-model="selectedProject" @submit="updateProject" />
        </BaseDialog>
    
        <v-snackbar v-model="showSuccess" timeout="3000" color="green">
            Project berhasil ditambahkan!
        </v-snackbar>
    
        <h2>Daftar Pekerja</h2>
    
        <v-row no-gutters class="mb-2">
            <v-col cols="3" class="pa-2">
                <v-text-field v-model="searchNIK" label="Cari Nik" clearable></v-text-field>
            </v-col>
            <v-col cols="3" class="pa-2">
                <v-autocomplete v-model="projectLocation" :items="locations" item-title="project_name"
                    item-value="id"
                    label="Cari Lokasi" clearable @update:model-value="selectLocation" >
                </v-autocomplete>
    
                <!-- <v-text-field v-model="projectLocation" label="Cari Lokasi" clearable></v-text-field> -->
            </v-col>
            <v-col cols="2" class="pa-5">
                <v-btn color="primary" @click="submitForm">Cari</v-btn>
            </v-col>
            <v-spacer></v-spacer>
    
            <v-col cols="auto" class="pa-5 d-flex">
                <v-btn color="primary" @click="addWorker()">
                    Add Pekerja
                </v-btn>
    
            </v-col>
        </v-row>
    
        <v-select v-model="perPage" :items="[1, 10, 50]" hide-details dense class="perpage-select">
        </v-select>
    
        <!-- Tabel Kehadiran -->
        <v-table>
            <thead>
                <tr>
                    <th>Nama Penerima</th>
                    <th>NIK</th>
                    <th>Status Pernikahan</th>
                    <th>Total Pendapatan Bulanan</th>
                    <th>Nama Proyek</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    
                <tr v-for="item in projects" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.nik }}</td>
                    <td>{{ item.status_ptkp }}</td>
                    <td>{{ item.penghasilan }}</td>
                    <td>{{ item.project.project_name }}</td>
                    <td>
                        <v-btn color="primary" @click="openUpdateDialog(item)">Update</v-btn>
                        <v-btn color="red" @click="openDeleteDialog(item)">Delete</v-btn>
    
                    </td>
                </tr>
            </tbody>
        </v-table>
    
        <v-pagination v-model="currentPage" :length="totalPages" @update:modelValue="fetchWorkers"></v-pagination>
    
        <br>
        <br>
    
        <!-- Filter -->
        <!-- <v-row no-gutters> -->
    
        <!-- <v-col cols="7">
                        
                                <v-row >
                                  <v-col cols="4">
                                    <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
                                  </v-col>
                                  
                                  <v-col cols="4">
                                    <v-select 
                                      v-model="selectedLocation" 
                                      label="Pilih Lokasi"
                                      :items="locations" 
                                      clearable>
                                    </v-select>
                        
                                  </v-col>
                        
                        
                                  <v-col cols="4">
                                    <div>
                                      <v-btn type="submit" color="primary">Submit</v-btn>
                                    </div>
                                  </v-col>
                        
                                </v-row>
                        
                        
                              </v-col> -->
    
        <!-- <v-col cols="5">
                    
                                <v-row justify="end">
                                    <v-col cols="auto">
                                        <v-btn color="primary" @click="addWorker()">
                                            Add Pekerja
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="auto">
                                        <BaseDialog v-model="isDialogExporOpen" title="Ekspor Pekerja dan Pajak" buttonText="Ekspor" buttonColor="danger" buttonVariant="tonal" @closed="isDialogExporOpen = false">
                                            <h2>Expor </h2>
                                            <br>
                                            <BaseForm :fields="formFieldsExpor" v-model="formDataExpor" @submit="submitFormExpor" />
                                        </BaseDialog>
                                    </v-col>
                    
                                </v-row>
                    
                            </v-col> -->
        <!-- </v-row> -->
    
        <!-- Tabel Kehadiran -->
        <!-- <v-table>
                            <thead>
                                <tr>
                                    <th>Nama Penerima</th>
                                    <th>NIK</th>
                                    <th>Status Pernikahan</th>
                                    <th>Total Pendapatan Bulanan</th>
                                    <th>Tempat Proyek</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in filteredAttendance" :key="index">
                                    <td>{{ item.nama }}</td>
                                    <td>{{ item.nik }}</td>
                                    <td>{{ item.statusPtkp }}</td>
                                    <td>{{ item.penghasilan }}</td>
                                    <td>{{ item.lokasiProyek }}</td>
                                    <td>
                                        <v-btn color="primary" @click="showDetail(item.id)">
                                            Show
                                        </v-btn>
                                        <v-btn color="primary" @click="update(item.id)">
                                            Update
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table> -->
    </v-container>
</template>

<script setup>
import BaseDialog from "../../src/components/BaseDialog.vue";
import BaseForm from "../../src/components/BaseForm.vue";
import { useWorkerStore } from '../src/stores/workerStore'
import { useProjectStore } from '../src/stores/projectStore'
import { useLoading } from '../src/composables/useLoading'
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import attendanceData from "../tax_data.js";

const router = useRouter();

const { isLoading, setLoading } = useLoading()
const workerStore = useWorkerStore();
const projectStore = useProjectStore();
const projectName = ref("");
const projectLocation = ref("");
const perPage = ref(10);
const currentPage = ref(1);
const projects = ref([]);
const totalPages = computed(() => Math.ceil(totalRecords.value / perPage.value));
const totalRecords = ref(0); // Tambahkan total records
const isAddProjectDialog = ref(false);
const showSuccess = ref(false);
const isDeleteDialogOpen = ref(false);
const projectToDelete = ref(null);
const showError = ref(false);

const selectedDetail = ref(null);
const isAddAWorkerOpen = ref(false);
const isDialogExporOpen = ref(false);
const isAddWorkerExcellOpen = ref(false);
const iseditMonthlyIncomeOpen = ref(false);
const searchNIK = ref("");
const selectedLocation = ref(null);
const locations = ref([])


const payload = computed(() => ({
    nik: searchNIK.value,
    project_id: projectLocation.value,
    per_page: perPage.value,
    page: currentPage.value,
}));

const fetchLocations = async () => {
    try {
        const response = await projectStore.fetchProjectLocation(payload.value);
        console.log("location", response.data);

        locations.value = response.data; // Simpan hasil response ke variabel projects
    } catch (error) {
        console.error('Error fetching locations:', error)
    }
}


const fetchWorkers = async () => {
    console.log("Payload:", payload.value);

    const response = await workerStore.fetchWorkers(payload.value);
    console.log("projects updated:12312312", response);

    if (response.data.length > 0) {
        totalRecords.value = response.total; // Pastikan API mengembalikan total data
        projects.value = response.data; // Simpan hasil response ke variabel projects
        console.log("projects updated321:", projects.value);
        console.log("projects :", response);
    } else {
        console.warn("No data received from API");
    }
};

onMounted(() => {
    fetchLocations();
    fetchWorkers();
});


// Watch perubahan perPage
watch(perPage, (newValue) => {
    console.log("Per Page changed:", newValue);
    console.log("Per Page changed:", newValue);
    fetchWorkers(); // Fetch data baru saat perPage berubah
});


const formData = ref({
    tanggal: "",
    project: "",
    file: null,
});

const formFieldsAdd = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
    { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
    { label: "Upload File", model: "file", type: "file", required: true },
];



const formDataEdit = ref({
    tanggal: "",
    project: "",
    file: null,
});

const formFieldsEdit = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
    { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
    { label: "Upload File", model: "file", type: "file", required: true },
];


const formDataExpor = ref({
    tanggal: "",
    project: "",
});

const formFieldsExpor = [

    { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
    { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
];


const submitForm = (data) => {
    fetchWorkers();
};

const submitFormExpor = (data) => {
    console.log("Data tersimpan:", data);
};


const addAttendance = (item) => {
    selectedDetail.value = item;
    isDialogExporOpen.value = true;
};




const addWorker = () => {
    router.push(`/worker/create`);
};


// Fungsi navigasi ke halaman show berdasarkan ID
const showDetail = (id) => {
    router.push(`/worker/${id}`);
};

const update = (id) => {
    router.push(`/worker/update?id=${id}`);

};

// Fungsi kembali ke halaman utama absensi
const goBack = () => {
    router.push("/attendance");
};

// Hitung total kehadiran
const getTotalHadir = (kehadiran) => {
    return kehadiran.filter(k => k.status === "Hadir").length;
};

// Filter data berdasarkan NIK dan lokasi
const filteredAttendance = computed(() => {
    return attendanceData.filter(item => {
        const matchNIK = searchNIK.value ? item.nik.includes(searchNIK.value) : true;
        const matchLocation = selectedLocation.value ? item.lokasiProyek === selectedLocation.value : true;
        return matchNIK && matchLocation;
    });
});
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