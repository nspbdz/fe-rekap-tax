<template>
  <v-container>
    <h2>Update Detail Pekerja</h2>

    <v-btn color="secondary" @click="goBack">Kembali</v-btn>
    <br>
    <br>

    <v-form @submit.prevent="submitForm">
      <!-- <BaseForm :fields="formFieldsAdd" v-model="formData" :showSubmit="false" /> -->
      <BaseForm :fields="formFieldsUpdate" v-model="formData" @submit="submitForm" :showSubmit="false" />
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseForm from "../../src/components/BaseForm.vue";

const router = useRouter();
const route = useRoute();
const formData = ref({
  lokasi: "",
  masa_pajak: "",
  tahun_pajak: "",
  nik: "",
  id_tku_penerima_penghasilan: "",
  status_ptkp: "",
  fasilitas: "",
  kode_objek_pajak: "",
  penghasilan: "",
  deemed: "",
  tarif: "",
  jenis_dok_referensi: "",
  nomor_dok_referensi: "",
  tanggal_dok_referensi: "",
  id_tku_pemotong: "",
  tanggal_pemotongan: "",
  tanggal: "",
  file: null,
});

const formFieldsUpdate = [
  { label: "Masa Pajak", model: "masa_pajak", type: "text", required: true },
  { label: "Tahun Pajak", model: "tahun_pajak", type: "text", required: true },
  { label: "Nik", model: "nik", type: "text", required: true },
  { label: "Project", model: "lokasi_proyek", type: "text", required: true },
  { label: "ID TKU Penerima Penghasilan", model: "id_tku_penerima_penghasilan", type: "text", required: true },
  { label: "Status Ptkp", model: "status_ptkp", type: "select", items: ["K/0", "TK/0"], required: true },
  { label: "Fasilitas", model: "fasilitas", type: "text", required: true },
  { label: "Kode Objek Pajak", model: "kode_objek_pajak", type: "text", required: true },
  { label: "Penghasilan", model: "penghasilan", type: "text", required: true },
  { label: "Deemed", model: "deemed", type: "text", required: true },
  { label: "Tarif", model: "tarif", type: "text", required: true },
  { label: "Jenis Dok. Referensi", model: "jenis_dok_referensi", type: "text", required: true },
  { label: "Nomor Dok. Referensi", model: "nomor_dok_referensi", type: "text", required: true },
  { label: "Tanggal Dok. Referensi", model: "tanggal_dok_referensi", type: "text", required: true },
  { label: "ID TKU Pemotong", model: "id_tku_pemotong", type: "text", required: true },
  { label: "Tanggal Pemotongan", model: "tanggal_pemotongan", type: "text", inputType: "date", required: true },
  { label: "Upload Foto", model: "file", type: "file", required: false },
];

// Fetch data dari backend atau sumber lain
onMounted(() => {
  const workerId = route.params.id;
  // Dummy data, ganti dengan API call
  formData.value = {
    lokasi_proyek: "cisauk",
    masa_pajak: "1",
    tahun_pajak: "2025",
    nik: "1001",
    id_tku_penerima_penghasilan: "3172024806201001000000",
    status_ptkp: "K/0",
    fasilitas: "N/A",
    kode_objek_pajak: "21-100-35",
    penghasilan: "6000000",
    deemed: "100",
    tarif: "0.75",
    jenis_dok_referensi: "Announcement",
    nomor_dok_referensi: "ABC123",
    tanggal_dok_referensi: "2024-01-13",
    id_tku_pemotong: "3172022407981001000000",
    tanggal_pemotongan: "2025-01-01",
    file: null,
  };
});

const submitForm = () => {
  alert(`Pekerja berhasil diperbarui!`);
  router.push("/worker");
};

const goBack = () => {
  router.push("/worker");
};
</script>
