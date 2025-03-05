<template>
    <v-container>
        <h2>Tambah Detail Pekerja</h2>
        <v-snackbar v-model="showSnackbarError" timeout="3000" color="red" location="top">
            {{ errorMessage }}
        </v-snackbar>
    
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
import { useWorkerStore } from '../src/stores/workerStore'
import BaseForm from "../../src/components/BaseForm.vue";
import axios from 'axios'

const workerStore = useWorkerStore()
const showSnackbarError = ref(false);

function getWorkerInfo() {
    console.log('NIK:', workerStore.workerData.nik)
    console.log('Project ID:', workerStore.workerData.project)
}


const errorMessage = ref(""); // Menyimpan pesan error dari backend
const selectedLocation = ref(null);
const locations = ["cisauk", "vbi", "sumarecon bekasi"];
const router = useRouter();
const nama = ref("");
const lokasi = ref("");
const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];



const formData = ref({
    name: "",
    project_id: "",
    tax_period:"",
    tax_year:"",
    nik:"",
    tku_id:"",
    status_ptkp:"",
    facility:"",
    tax_object_code:"",
    income:"" ,
    deemed:"" ,
    rate:"" ,
    document_type:"",
    document_number:"",
    document_date:"",
    tax_cutter_id:"",
    deduction_date:"",
    ktp_photo:"",
});

onMounted(() => {
    getWorkerInfo();
    const workerData = computed(() => workerStore.workerData)
    formData.value.nik = workerData.value.nik
    formData.value.project_id = workerData.value.project_id
    console.log('workerData11111111111111', workerData)
    console.log('workerData11111111111111', formData)
});

const formFieldsAdd = [

    { label: "Nama", model: "name", type: "text", required: true },
    { label: "Masa Pajak", model: "tax_period", type: "text", required: true },
    { label: "Tahun Pajak", model: "tax_year", type: "text", required: true },
    { label: "Nik", model: "nik", type: "text", required: true },
    { label: "ID TKU Penerima Penghasilan", model: "tku_id", type: "text", required: true },
    { label: "Status Ptkp ", model: "status_ptkp", type: "select", items: ["K/0", "TK/0"], required: true },
    { label: "fasilitas", model: "facility", type: "text", required: true },
    { label: "Kode Objek Pajak", model: "tax_object_code", type: "text", required: true },
    { label: "Penghasilan", model: "income", type: "text", required: true },
    { label: "Deemed", model: "deemed", type: "text", required: true },
    { label: "Tarif", model: "rate", type: "text", required: true },
    { label: "Jenis Dok. Referensi", model: "document_type", type: "text", required: true },
    { label: "Nomor Dok. Referensi", model: "document_number", type: "text", required: true },
    { label: "Tanggal Dok. Referensi", model: "document_date", type: "text", inputType: "date", required: true },
    { label: "ID TKU Pemotong", model: "tax_cutter_id", type: "text", required: true },
    { label: "Tanggal Pemotongan", model: "deduction_date", type: "text", inputType: "date", required: true },
    { label: "Upload Foto", model: "ktp_photo", type: "file", required: true },
    { label: "Proyek", model: "project_id", type: "hidden", required: true },
];

// Simpan data baru (dummy, belum ke backend)
const submitForm = async () => {

    try {
        console.log('formData.ktp_photoktp_photo', formData.value.ktp_photo)

        const formDataToSend = new FormData();

        for (const key in formData.value) {
            if (formData.value[key] !== null && formData.value[key] !== undefined) {
                formDataToSend.append(key, formData.value[key]);
            }
        }

        try {
            const response = await axios.post(
                'http://localhost:9010/api/v1/workers/store',
                formDataToSend, {
                    headers: {
                        'Accept': 'application/json'
                        // Jangan set 'Content-Type' secara manual karena browser akan mengaturnya untuk FormData
                    }
                }
            );
            console.log('Response:', response);
            alert('Upload berhasil!');
            router.push("/worker");

        } catch (error) {
            const firstError = Object.values(error.response?.data.errors || {})[0]?.[0] || "Terjadi kesalahan.";
            alert(firstError);
        }

    } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data.errors) {
            errorMessage.value = error.response.data.errors.nik ?
                error.response.data.errors.nik[0] // Ambil pesan error NIK
                :
                "Terjadi kesalahan.";
        } else {

            errorMessage.value = "Terjadi kesalahan dalam 123123.";
        }
        showSnackbarError.value = true; // Tampilkan snackbar jika terjadi error
    }
};

// Kembali ke halaman Index
const goBack = () => {
    router.push("/worker/create");
};
</script>
  