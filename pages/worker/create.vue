lokasilokasi<template>
    <v-container>
        <v-snackbar v-model="showSnackbarError" timeout="3000" color="red" location="top">
            NIK sudah digunakan!
        </v-snackbar>
    
        <h2>Tambah Pekerja</h2>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br>
        <br>
        <v-form @submit.prevent="submitForm">
            <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="submitForm" />
        </v-form>
    </v-container>
</template>
  
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "../../src/components/BaseForm.vue";
import { useWorkerStore } from '../src/stores/workerStore'
import workerService from "~/src/services/workerService";

const selectedLocation = ref(null);
const workerStore = useWorkerStore();
const locations = ["cisauk", "vbi", "sumarecon bekasi"];
const router = useRouter();
const nama = ref("");
const lokasi = ref("");
const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];
const showSnackbarError = ref(false);


const formData = ref({
    nik: "8966086673414030",
    project: "1"
});

const payload = computed(() => ({
    nik: formData.value.nik,
    project: formData.value.project
}));


const formFieldsAdd = [

    { label: "Nik", model: "nik", type: "text", required: true },
    { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
];

// Simpan data baru (dummy, belum ke backend)

const submitForm = async () => {
    try {
        const response = await workerStore.checkNik(payload.value);
        
        if (!response.success) {
            showSnackbarError.value = true; // Munculkan snackbar jika NIK sudah digunakan
            return;
        }

        // Jika NIK tersedia, simpan data dan lanjut ke halaman create detail
        await workerService.nikCheck(payload.value);
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
  