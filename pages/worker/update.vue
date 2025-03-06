<template>
    <v-container>
        <h2>Update Detail Pekerja</h2>
    
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br>
        <br>
    
        <v-form @submit.prevent="submitForm" >
            <BaseForm :fields="formFieldsUpdate" v-model="formData" @submit="submitForm" />
            
            <!-- <div v-if="formData.ktp_photo">
                <p>Foto KTP Saat Ini:</p>
                <img :src="formData.ktp_photo" alt="KTP Photo" style="max-width: 200px;">
            </div>
             -->
            <v-file-input 
                label="Upload Foto KTP Baru" 
                @change="handleFileUpload" 
                accept="image/*" />

            <!-- <div v-if="formData.ktp_photo">
            <img :src="formData.ktp_photo" alt="KTP Photo" style="max-width: 200px;">
            </div> -->
        <div v-if="formData.file">
            
            <v-img
                v-if="formData.file"
                :src="formData.file"
                class="ktp-preview"
                max-height="200"
                max-width="200"
            ></v-img>
            </div>
            <div v-else>
            <img :src="formData.ktp_photo" alt="KTP Photo" style="max-width: 200px;">
            </div>

        </v-form>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseForm from "../../src/components/BaseForm.vue";
import { useWorkerStore } from '../src/stores/workerStore';
import axios from 'axios'

const router = useRouter();
const route = useRoute();
const workerStore = useWorkerStore();
const id = parseInt(route.query.id);

const formData = ref({
    name: "",
    project_id: "",
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
    ktp_photo: null,
    file: null,
});

const formFieldsUpdate = [
    { label: "Nama", model: "name", type: "text", required: true },
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
    { label: "Tanggal Dok. Referensi", model: "document_date", type: "text", inputType: "date", required: true },
    { label: "ID TKU Pemotong", model: "tax_cutter_id", type: "text", required: true },
    { label: "Tanggal Pemotongan", model: "deduction_date", type: "text", inputType: "date", required: true },
    { label: "Proyek", model: "project_id", type: "hidden", required: true },
];

const handleData = async () => {
    try {
        const response = await workerStore.detailWorker({ id });
        if (response.data) {
            Object.assign(formData.value, {
                ...response.data.taxpayer,
                project_id: response.data.project_id,
                tax_transaction_id: response.data.id,
                tax_period: response.data.tax_period,
                tax_year: response.data.tax_year,
                tax_object_code: response.data.tax_object_code,
                income: response.data.income,
                deemed: response.data.deemed,
                rate: response.data.rate,
                document_type: response.data.tax_document.document_type,
                document_number: response.data.tax_document.document_number,
                tax_cutter_id: response.data.tax_cutter.tku_id,
                deduction_date: response.data.deduction_date,
                ktp_photo: response.data.taxpayer.ktp_photo,
            });
        }
    } catch (error) {
        console.warn("Error fetching data:", error);
    }
};

// const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     formData.value.file = file;
//     console.log('formData.value.file formData.value.file ', formData.value )
//     console.log('formData.value.file  ', event.target )

//     if (file) {
//         formData.value.file = file;
//         // formData.value.ktp_photo = file;
//         previewImage(event);
//     }
// };

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        formData.value.file = file; // Simpan file asli
        previewImage(file);
    }
};

const previewImage = (file) => {
    if (formData.value.file && typeof formData.value.file === 'string') {
        URL.revokeObjectURL(formData.value.file); // Hapus URL blob lama agar tidak bocor memori
    }
    formData.value.ktp_photo = URL.createObjectURL(file); // Hanya untuk preview
    
};


// const previewImage = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//         formData.value.file = URL.createObjectURL(file);
//     }
// };

const submitForm = async () => {
    try {
        console.log('tttt', formData.value)
        const formDataToSend = new FormData();

        for (const key in formData.value) {
            if (formData.value[key] !== null && formData.value[key] !== undefined) {
                if (key === 'file' && formData.value[key] instanceof File) {
                    formDataToSend.append(key, formData.value[key]); // Kirim file biner
                } else if (key !== 'file' && key !== 'ktp_photo') {
                    formDataToSend.append(key, formData.value[key]);
                }
            }
        }
        // for (const key in formData.value) {
        //     if (formData.value[key] !== null && formData.value[key] !== undefined && key !== 'ktp_photo') {
        //         formDataToSend.append(key, formData.value[key]);
        //     }
        // }

        const response = await axios.post(
            'http://localhost:9010/api/v1/workers/update',
            formDataToSend, {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
};

const goBack = () => {
    router.push("/worker");
};

onMounted(() => {
    handleData();
});
</script>
