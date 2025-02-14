lokasilokasi<template>
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
  import BaseForm from "../../src/components/BaseForm.vue";

  const selectedLocation = ref(null);
  const locations = ["cisauk", "vbi", "sumarecon bekasi"];
  const router = useRouter();
  const nama = ref("");
  const lokasi = ref("");
  const lokasiOptions = ["Cisauk", "VBI", "Sumarecon Bekasi"];
  

const formData = ref({
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

const formFieldsAdd = [
  
  { label: "Masa Pajak", model: "masa_pajak", type: "text", required: true },
  { label: "Tahun Pajak", model: "tahun_pajak", type: "text", required: true },
  { label: "Nik", model: "nik", type: "text",  required: true },
  { label: "ID TKU Penerima Penghasilan", model: "id_tku_penerima_penghasilan", type: "text",  required: true },
  { label: "Status Ptkp ", model: "status_ptkp", type: "select", items: ["K/0", "TK/0"], required: true },
  { label: "fasilitas", model: "fasilitas", type: "text",  required: true },
  { label: "Kode Objek Pajak", model: "kode_objek_pajak", type: "text",  required: true },
  { label: "Penghasilan", model: "penghasilan", type: "text",  required: true },
  { label: "Deemed", model: "deemed", type: "text",  required: true },
  { label: "Tarif", model: "tarif", type: "text",  required: true },
  { label: "Jenis Dok. Referensi", model: "jenis_dok_referensi", type: "text",  required: true },
  { label: "Nomor Dok. Referensi", model: "nomor_dok_referensi", type: "text",  required: true },
  { label: "Tanggal Dok. Referensi", model: "tanggal_dok_referensi", type: "text",  required: true },
  { label: "ID TKU Pemotong", model: "id_tku_pemotong", type: "text", required: true },
  { label: "Tanggal Pemotongan", model: "tanggal_pemotongan", type: "text", inputType: "date", required: true },
  { label: "Upload Foto", model: "file", type: "file", required: true },
];

  // Simpan data baru (dummy, belum ke backend)
  const submitForm = () => {
    alert(`Pekerja berhasil ditambahkan!`);
    router.push("/worker");
  };

  // Kembali ke halaman Index
  const goBack = () => {
    router.push("/worker/create");
  };

  </script>
  