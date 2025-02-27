<template>
    <v-container>
        <h2>Update Detail Pekerja</h2>
    
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br>
        <br>
    
        <v-form @submit.prevent="submitForm">
            <BaseForm :fields="formFieldsUpdate" v-model="formData" @submit="submitForm" />
        </v-form>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseForm from "../../src/components/BaseForm.vue";
import { useWorkerStore } from '../src/stores/workerStore';

const router = useRouter();
const route = useRoute();
const workerStore = useWorkerStore();
const id = parseInt(route.query.id); // Ambil ID dari URL query (?id=1)

console.log('ID:', id);

const formData = ref({
    tax_period: "",
    tax_year: "",
    nik: "",
    tku_id: "",
    status_ptkp: "",
    facility: "",
    tax_object_code: "",
    income: "",
    deemed: "",
    rate: "",
    document_type: "",
    document_number: "",
    document_date: "",
    tax_cutter_id: "",
    deduction_date: "",
    file: null,
});


const formFieldsUpdate = [
    { label: "Masa Pajak", model: "tax_period", type: "text", required: true },
    { label: "Tahun Pajak", model: "tax_year", type: "text", required: true },
    { label: "Nik", model: "nik", type: "text", required: true },
    { label: "ID TKU Penerima Penghasilan", model: "tku_id", type: "text", required: true },
    { label: "Status Ptkp", model: "status_ptkp", type: "select", items: ["K/0", "TK/0"], required: true },
    { label: "Fasilitas", model: "facility", type: "text", required: true },
    { label: "Kode Objek Pajak", model: "tax_object_code", type: "text", required: true },
    { label: "Penghasilan", model: "income", type: "text", required: true },
    { label: "Deemed", model: "deemed", type: "text", required: true },
    { label: "Tarif", model: "rate", type: "text", required: true },
    { label: "Jenis Dok. Referensi", model: "document_type", type: "text", required: true },
    { label: "Nomor Dok. Referensi", model: "document_number", type: "text", required: true },
    { label: "Tanggal Dok. Referensi", model: "document_date", type: "text",  inputType: "date", required: true },
    { label: "ID TKU Pemotong", model: "tax_cutter_id", type: "text", required: true },
    { label: "Tanggal Pemotongan", model: "deduction_date", type: "text", inputType: "date", required: true },
    { label: "Upload Foto", model: "file", type: "file", required: false },
];

const handleData = async () => {
    try {
        const response = await workerStore.detailWorker({ id });
        if (response.data) {
            Object.assign(formData.value, {
                tax_transaction_id: response.data.id,
                tax_period: response.data.tax_period,
                tax_year: response.data.tax_year,
                nik: response.data.taxpayer.nik,
                tku_id: response.data.taxpayer.tku_id,
                status_ptkp: response.data.taxpayer.status_ptkp,
                facility: response.data.taxpayer.facility,
                tax_object_code: response.data.tax_object_code,
                income: response.data.income,
                deemed: response.data.deemed,
                rate: response.data.rate,
                document_type: response.data.tax_document.document_type,
                document_number: response.data.tax_document.document_number,
                tax_cutter_id: response.data.tax_cutter.tku_id,
                deduction_date: response.data.deduction_date,
                file: response.data.file,
            });
        }
        console.log('dddata', formData.value)
    } catch (error) {
        console.warn("Error fetching data:", error);
    }
};

// Fetch data dari backend atau sumber lain
onMounted(() => {
    handleData();

});

const submitForm = async () => {
    try {
        const formDataToSend = new FormData();

        if (!formData.value.tax_transaction_id) {
            console.error("ID tidak ditemukan!");
            return;
        }
        for (const key in formData.value) {
            if (formData.value[key] !== null && formData.value[key] !== undefined) {
                formDataToSend.append(key, formData.value[key]);
            }
        }

        const response = await workerStore.updateWorker(formDataToSend);
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
};


// const submitForm = () => {
//   alert(`Pekerja berhasil diperbarui!`);
//   router.push("/worker");
// };

const goBack = () => {
    router.push("/worker");
};
</script>
