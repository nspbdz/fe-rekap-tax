lokasilokasi<template>
    <v-container>
        <v-snackbar v-model="showSnackbarError" timeout="3000" color="red" location="top">
            NIK sudah digunakan!
        </v-snackbar>
    
        <h2>Tambah Pekerja</h2>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br>
        <br>
        <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="submitForm" />
    
    </v-container>
</template>
  
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "../../src/components/BaseForm";
import { useWorkerStore } from '../src/stores/workerStore'
import workerService from "~/src/services/workerService";
import { useProjectStore } from '../src/stores/projectStore'

const selectedLocation = ref(null);
const workerStore = useWorkerStore();
const router = useRouter();
const nama = ref("");
const lokasi = ref("");
const showSnackbarError = ref(false);
const locations = ref([])
const locationsDropdown = ref([])
const projectStore = useProjectStore();


const fetchLocations = async () => {
    try {
        const response = await projectStore.fetchProjectLocation(payload.value);
        console.log("location", response.data);

        locationsDropdown.value = response.data.map(loc => ({
            id: loc.id,
            name: loc.project_name
        }));
        console.log("location123321", locationsDropdown);
       const itemsss =  locationsDropdown.value.map(loc => ({id: loc.id,name: loc.name }) ) // Ambil nama lokasi dari API
       console.log("itemsss", itemsss);

    } catch (error) {
        console.error('Error fetching locations:', error)
    }
}

onMounted(() => {
    fetchLocations();

});


const formData = ref({
    nik: "",
    project_id: ""
});

const payload = computed(() => ({
    nik: formData.value.nik,
    project: formData.value.project
}));


const formFieldsAdd = computed(() => [


    { label: "Nik", model: "nik", type: "text", required: true },
    {
        label: "Project",
        model: "project_id",
        type: "select",
        itemTitle: "name",
        itemValue: "id",
        items: locationsDropdown.value.map(loc => ({ id: loc.id, name: loc.name })), // Ambil nama lokasi dari API
        required: false
    },
]);



// Simpan data baru (dummy, belum ke backend)

const submitForm = async () => {
    try {

        const response = await workerStore.checkNik(formData.value);

        if (!response.success) {
            showSnackbarError.value = true; // Munculkan snackbar jika NIK sudah digunakan
            return;
        }
        // const workerData = computed(() => workerStore.workerData)
        // console.log('workerData11111111111111', workerData)
        // Jika NIK tersedia, simpan data dan lanjut ke halaman create detail
        router.push(`/worker/create-detail`);

    } catch (error) {
        console.error("Error saat mengirim data:", error);
        showSnackbarError.value = true; // Tampilkan snackbar jika terjadi error
    }
};



// Kembali ke halaman Index
const goBack = () => {
    router.push("/worker");
};
</script>
  