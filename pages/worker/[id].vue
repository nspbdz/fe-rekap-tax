<template>
    <v-container>
        <h2>Detail Pekerja</h2>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br><br>
    
        <v-card class="pa-4">
            <div v-for="(value, key) in displayFields" :key="key" class="mb-3">
                <strong>{{ key }}:</strong> <span>{{ value }}</span>
            </div>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useWorkerStore } from '../src/stores/workerStore';

const router = useRouter();
const route = useRoute();
const workerStore = useWorkerStore();
const id = parseInt(route.params.id);

const formData = ref({});

const displayFields = ref({
    "Masa Pajak": "123123",
    "Tahun Pajak": "",
    "NIK": "",
    "Project": "",
    "ID TKU Penerima Penghasilan": "",
    "Status PTKP": "",
    "Fasilitas": "",
    "Kode Objek Pajak": "",
    "Penghasilan": "",
    "Deemed": "",
    "Tarif": "",
    "Jenis Dok. Referensi": "",
    "Nomor Dok. Referensi": "",
    "Tanggal Dok. Referensi": "",
    "ID TKU Pemotong": "",
    "Tanggal Pemotongan": "",
    // "Upload Foto": "",
});

const handleData = async () => {
    try {
        const response = await workerStore.detailWorker({ id });
        if (response.data) {
            formData.value = response.data;
            console.log('asdasd', response.data)

            // Memasukkan data secara manual
            displayFields.value = {
                "Masa Pajak": formData.value.tax_period || "-",
                "Tahun Pajak": formData.value.tax_year || "-",
                "NIK": formData.value.taxpayer.nik || "-",
                "Project": formData.value.project.project_name || "-",
                "ID TKU Penerima Penghasilan": formData.value.taxpayer.tku_id || "-",
                "Status PTKP": formData.value.taxpayer.status_ptkp || "-",
                "Fasilitas": formData.value.taxpayer.facility || "-",
                "Kode Objek Pajak": formData.value.tax_object_code || "-",
                "Penghasilan": formData.value.income || "-",
                "Deemed": formData.value.deemed || "-",
                "Tarif": formData.value.rate || "-",
                "Jenis Dok. Referensi": formData.value.tax_document.document_type || "-",
                "Nomor Dok. Referensi": formData.value.tax_document.document_number || "-",
                "Tanggal Dok. Referensi": formData.value.tax_document.document_date || "-",
                "ID TKU Pemotong": formData.value.tax_cutter.tku_id || "-",
                "Tanggal Pemotongan": formData.value.deduction_date || "-",
                // "Upload Foto": formData.value.file ? "Ada file" : "Tidak ada file",
            };
        }
    } catch (error) {
        console.warn("Error fetching data:", error);
    }
};


onMounted(handleData);

const goBack = () => {
    router.push("/worker");
};
</script>
