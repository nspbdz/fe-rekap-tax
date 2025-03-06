<template>
    <v-container v-if="isDataLoaded">
        <h2>Detail Pekerja</h2>
        <v-btn color="secondary" @click="goBack">Kembali</v-btn>
        <br><br>
    
        <v-card class="pa-4">
            <div v-for="(value, key) in displayFields" :key="key" class="mb-3">
                <strong>{{ key }}:</strong>
                <span v-if="key !== 'KTP Photo'">{{ value }}</span>
                <v-img v-else-if="ktp_photo" :src="ktp_photo" alt="KTP Photo" width="200" height="150" />
                <!-- <v-img v-else-if="imageBase642" :src="imageBase642" alt="KTP Photo" width="200" height="150" /> -->
                
            </div>
        </v-card>
    </v-container>
    
    <v-container v-else>
        <v-alert type="error" class="mt-4">
            Data tidak ditemukan atau terjadi kesalahan saat mengambil data.
        </v-alert>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useWorkerStore } from '../src/stores/workerStore';
import { useAttendanceStore } from '../src/stores/attendanceStore'

const router = useRouter();
const route = useRoute();
const workerStore = useWorkerStore();
const id = parseInt(route.params.id);
const isDataLoaded = ref(false);
const formData = ref({});
const ktp_photo = ref(""); // Untuk menyimpan URL KTP Photo
const attendanceStore = useAttendanceStore();

const displayFields = ref({
    "Penghasilan Bulan Ini": "",
    "Masa Pajak": "",
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
    "KTP Photo": "",
});

const handleData = async () => {
    try {
        const response = await workerStore.detailWorker({ id });
        if (response.data) {
            formData.value = response.data;
            isDataLoaded.value = true;
            const options = { year: 'numeric', month: '2-digit', timeZone: 'Asia/Jakarta' };
            const today = new Date().toLocaleString("id-ID", options);

            const [month, year] = today.split("/");

            const payloadAttendance = computed(() => ({
                id: formData.value.taxpayer.id,
                month: month,
                year: year,
            }));

            const attendanceData = await attendanceStore.summaryAttendanceStore(payloadAttendance.value);

            ktp_photo.value = formData.value.taxpayer?.ktp_photo || "";
            // Isi data
            displayFields.value = {
                "Masa Pajak": formData.value.tax_period || "-",
                "Tahun Pajak": formData.value.tax_year || "-",
                "NIK": formData.value.taxpayer?.nik || "-",
                "Project": formData.value.project?.project_name || "-",
                "ID TKU Penerima Penghasilan": formData.value.taxpayer?.tku_id || "-",
                "Status PTKP": formData.value.taxpayer?.status_ptkp || "-",
                "Fasilitas": formData.value.taxpayer?.facility || "-",
                "Kode Objek Pajak": formData.value.tax_object_code || "-",
                "Penghasilan": formData.value.income || "-",
                "Penghasilan Bulan Ini": formData.value.income * attendanceData.data || "-",
                "Deemed": formData.value.deemed || "-",
                "Tarif": formData.value.rate || "-",
                "Jenis Dok. Referensi": formData.value.tax_document?.document_type || "-",
                "Nomor Dok. Referensi": formData.value.tax_document?.document_number || "-",
                "Tanggal Dok. Referensi": formData.value.tax_document?.document_date || "-",
                "ID TKU Pemotong": formData.value.tax_cutter?.tku_id || "-",
                "Tanggal Pemotongan": formData.value.deduction_date || "-",
                "KTP Photo": ktp_photo.value ? "Tersedia" : "Tidak Ada",
            };
            console.log('ktp_photoaaaaaaaa', ktp_photo)
            console.log('displayFields', displayFields)
            
        } else {
            isDataLoaded.value = false;
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
