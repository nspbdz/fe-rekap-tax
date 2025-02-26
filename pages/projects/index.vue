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
    
        <h2>Daftar Proyek</h2>
    
        <v-row no-gutters class="mb-2">
            <v-col cols="3" class="pa-2">
                <v-text-field v-model="projectName" label="Cari Project" clearable></v-text-field>
            </v-col>
            <v-col cols="3" class="pa-2">
                <v-text-field v-model="projectLocation" label="Cari Lokasi" clearable></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-5">
                <v-btn color="primary" @click="submitForm">Cari</v-btn>
            </v-col>
            <v-spacer></v-spacer>
    
            <v-col cols="auto" class="pa-2 d-flex">
                <BaseDialog v-model="isAddProjectDialog" title="Add Project" buttonText="Add Project" buttonColor="primary" buttonVariant="tonal" @closed="isAddProjectDialog = false">
                    <h2>Form Project</h2>
                    <br>
                    <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="addProject" />
                </BaseDialog>
    
            </v-col>
        </v-row>
    
    
        <v-select v-model="perPage" :items="[1, 10, 50]" hide-details dense class="perpage-select">
        </v-select>
    
        <!-- Tabel Kehadiran -->
        <v-table>
            <thead>
                <tr>
                    <th>Nama Proyek</th>
                    <th>Lokasi</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    
                <tr v-for="item in projects" :key="item.id">
                    <td>{{ item.project_name }}</td>
                    <td>{{ item.project_location }}</td>
                    <td>
                        <v-btn color="primary" @click="openUpdateDialog(item)">Update</v-btn>
                        <v-btn color="red" @click="openDeleteDialog(item)">Delete</v-btn>
    
                    </td>
                </tr>
            </tbody>
        </v-table>
    
        <v-pagination v-model="currentPage" :length="totalPages" @update:modelValue="fetchProjects"></v-pagination>
    
    </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import BaseDialog from "../../src/components/BaseDialog";
import BaseForm from "../../src/components/BaseForm";
import { useProjectStore } from '../src/stores/projectStore'
import { useLoading } from '../src/composables/useLoading'

const router = useRouter();
const { isLoading, setLoading } = useLoading()
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


const isUpdateDialogOpen = ref(false);
const selectedProject = ref({ project_id: "", project_name: "", project_location: "" });

const payload = computed(() => ({
    project_name: projectName.value,
    project_location: projectLocation.value,
    per_page: perPage.value,
    page: currentPage.value,
}));

const fetchProjects = async () => {
    console.log("Payload:", payload.value);

    const response = await projectStore.fetchProjects(payload.value);
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
    fetchProjects();
});


// Watch perubahan perPage
watch(perPage, (newValue) => {
    console.log("Per Page changed:", newValue);
    console.log("Per Page changed:", newValue);
    fetchProjects(); // Fetch data baru saat perPage berubah
});


const formData = computed(() => ({
    project_name: "",
    project_location: "",
}));

const formFieldsAdd = [

    { label: "Project", model: "project_name", type: "text", required: true },
    { label: "Location", model: "project_location", type: "text", required: true },
];

const formFieldsUpdate = [
    { label: "ID", model: "id", type: "hidden", required: true }, // Pastikan ID ada di form
    { label: "Nama Proyek", model: "project_name", type: "text", required: true },
    { label: "Lokasi", model: "project_location", type: "text", required: true },
];



const submitForm = (data) => {
    fetchProjects();
};


const openUpdateDialog = (item) => {
    console.log('aa12321323123', item)
    selectedProject.value = { id: item.id, project_name: item.project_name, project_location: item.project_location }; // Pastikan ID ada
    console.log('selectedProjectselectedProject', selectedProject.value)

    isUpdateDialogOpen.value = true; // Buka dialog
};

const openDeleteDialog = (item) => {
    projectToDelete.value = item;
    isDeleteDialogOpen.value = true;
};

const updateProject = async () => {
    try {

        if (!selectedProject.value.id) {
            console.error("ID tidak ditemukan!");
            return;
        }

        const response = await projectStore.updateProject(selectedProject.value);
        console.log('Update response:', response);

        if (response.success) {
            showSuccess.value = true; // Munculkan notifikasi sukses
            isUpdateDialogOpen.value = false; // Tutup dialog
            fetchProjects(); // Refresh data di tabel
        } else {
            showError.value = true; // Munculkan notifikasi gagal
        }
    } catch (error) {
        console.error('Error:', error);
        showError.value = true; // Munculkan notifikasi gagal
    }
};


const addProject = async (item) => {
    try {
        formData.value.project_name = item.project_name;
        formData.value.project_location = item.project_location;

        const response = await projectStore.addProject(formData.value);
        console.log('ressss123', response);

        if (response.success) {
            showSuccess.value = true; // Munculkan popup sukses
            isAddProjectDialog.value = false; // Tutup dialog
        } else {
            showError.value = true; // Munculkan popup gagal jika response tidak sukses
        }
    } catch (error) {
        console.error('Error:', error);
        showError.value = true; // Munculkan popup gagal jika terjadi error
    }
};

const handleDeleteConfirmed = async () => {
    if (!projectToDelete.value) return;
    console.log('projectToDelete.value', projectToDelete.value.id)

    try {
        const response = await projectStore.deleteProject(projectToDelete.value.id);
        if (response.success) {
            projects.value = projects.value.filter(p => p.id !== projectToDelete.value.id);
        } else {
            showError.value = true;
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        showError.value = true;
    }

    isDeleteDialogOpen.value = false;
    projectToDelete.value = null;
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