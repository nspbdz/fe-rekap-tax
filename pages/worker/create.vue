lokasilokasi<template>
    <v-container>
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

const selectedLocation = ref(null);
const workerStore = useWorkerStore();
const locations = ["cisauk", "vbi", "sumarecon bekasi"];
const router = useRouter();
const nama = ref("");
const lokasi = ref("");
const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];

const formData = ref({
    nik: "123",
    project: "1",
});

const formFieldsAdd = [

    { label: "Nik", model: "nik", type: "text", required: true },
    { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
];

// Simpan data baru (dummy, belum ke backend)

const submitForm = () => {
    console.log('aaaaaa')
    workerStore.setWorkerData(formData.value);
    router.push(`/worker/create-detail`);
};

// Kembali ke halaman Index
const goBack = () => {
    router.push("/worker");
};
</script>
  