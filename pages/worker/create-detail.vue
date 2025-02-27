<template>
    <v-container>
        <h2>Tambah Detail Pekerja</h2>
    
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
const workerStore = useWorkerStore()

function getWorkerInfo() {
    console.log('NIK:', workerStore.workerData.nik)
    console.log('Project ID:', workerStore.workerData.project)
}



const selectedLocation = ref(null);
const locations = ["cisauk", "vbi", "sumarecon bekasi"];
const router = useRouter();
const nama = ref("");
const lokasi = ref("");
const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];

onMounted(() => {
    getWorkerInfo();
});

const formData = ref({
    project_id: 1,
    npwp: 3123,
    tax_period: 2,
    tax_year: "1995",
    nik: "123",
    tku_id: 1,
    status_ptkp: "1",
    facility: "1",
    tax_object_code: "21-121-60",
    income: "2876948.35",
    deemed: "480.24",
    rate: "1.31",
    document_type: 1,
    document_number: 1,
    document_date: 1,
    tax_cutter_id: 1,
    deduction_date: "1995-12-31",
    file: null,
});

const formFieldsAdd = [

    { label: "Masa Pajak", model: "tax_period", type: "text", required: true },
    { label: "Tahun Pajak", model: "tax_year", type: "text", required: true },
    { label: "Nik", model: "nik", type: "text", required: true },
    { label: "npwp", model: "npwp", type: "text", required: true },
    { label: "ID TKU Penerima Penghasilan", model: "tku_id", type: "text", required: true },
    { label: "Status Ptkp ", model: "status_ptkp", type: "select", items: ["K/0", "TK/0"], required: true },
    { label: "fasilitas", model: "facility", type: "text", required: true },
    { label: "Kode Objek Pajak", model: "tax_object_code", type: "text", required: true },
    { label: "Penghasilan", model: "income", type: "text", required: true },
    { label: "Deemed", model: "deemed", type: "text", required: true },
    { label: "Tarif", model: "rate", type: "text", required: true },
    { label: "Jenis Dok. Referensi", model: "document_type", type: "text", required: true },
    { label: "Nomor Dok. Referensi", model: "document_number", type: "text", required: true },
    { label: "Tanggal Dok. Referensi", model: "document_date", type: "text", required: true },
    { label: "ID TKU Pemotong", model: "tax_cutter_id", type: "text", required: true },
    { label: "Tanggal Pemotongan", model: "deduction_date", type: "text", inputType: "date", required: true },
    { label: "Upload Foto", model: "file", type: "file", required: true },
];

// Simpan data baru (dummy, belum ke backend)
const submitForm = async () => {

    try {
        console.log('formData.value', formData.value)

        const formDataToSend = new FormData();

        for (const key in formData.value) {
            if (formData.value[key] !== null && formData.value[key] !== undefined) {
                formDataToSend.append(key, formData.value[key]);
            }
        }
        console.log('formData.value', formData.value)
        const response = await workerStore.addWorkerStore(formDataToSend);
        console.log('Update response:', response);

        if (response.success) {
            showSuccess.value = true; // Munculkan notifikasi sukses
            isUpdateDialogOpen.value = false; // Tutup dialog
            // goBack(); // Refresh data di tabel
        } else {
            showError.value = true; // Munculkan notifikasi gagal
        }

    } catch (error) {
        console.error('Error:', error);
        showError.value = true; // Munculkan notifikasi gagal
    }
    // alert(`Pekerja berhasil ditambahkan!`);
    // router.push("/worker");
};

// Kembali ke halaman Index
const goBack = () => {
    router.push("/worker/create");
};
</script>
  