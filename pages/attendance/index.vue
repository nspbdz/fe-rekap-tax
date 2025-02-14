  <template>
  <v-container>
    <h2>Daftar Kehadiran</h2>

    <!-- Tombol Kembali -->
    <div >

    <v-btn color="secondary" @click="goBack">Kembali</v-btn>
    </div>
    <br>
    <!-- Filter -->
    <v-row no-gutters>
      <v-col cols="9">

        <v-row >
          <v-col cols="4" class="d-flex align-center">
            <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
          </v-col>
          
          <v-col cols="4" class="d-flex align-center">
            <v-select 
              v-model="selectedLocation" 
              label="Pilih Lokasi"
              :items="locations" 
              clearable>
            </v-select>

          </v-col>


          <v-col cols="4" class="d-flex align-center" style="margin-top: -20px;">
            
            <v-btn type="submit" color="primary">Submit</v-btn>
          </v-col>

        </v-row>


      </v-col>

      <v-col cols="3">
        <v-row >
          <v-col cols="6">
            <BaseDialog
            v-model="isAddAbsensiOpen"
            title="Add Absensi"
            buttonText="Add Absensi"
            buttonColor="danger"
            buttonVariant="tonal"
            @closed="isAddAbsensiOpen = false"
            >
            <h2>Form Kehadiran</h2>
            <br>
            <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="submitForm" />
            </BaseDialog>
          </v-col>

          <v-col cols="6">
            <BaseDialog
            v-model="isDialogExporOpen"
            title="Ekspor Absensi"
            buttonText="Ekspor"
            buttonColor="danger"
            buttonVariant="tonal"
            @closed="isDialogExporOpen = false"
            >
            <h2>Expor </h2>
            <br>
            <BaseForm :fields="formFieldsExpor" v-model="formDataExpor" @submit="submitFormExpor" />
            </BaseDialog>

        </v-col>

        </v-row>
      </v-col>
    </v-row>

    <!-- <v-row class="my-4">
      <v-col cols="8" md="4">
        <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
      </v-col>
      <v-col cols="8" md="4">
        <v-select 
          v-model="selectedLocation" 
          label="Pilih Lokasi"
          :items="locations" 
          clearable>
        </v-select>
      </v-col>
      <v-col cols="8" md="4">
        <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
      </v-col>
    </v-row> -->

    <!-- Tabel Kehadiran -->
    <v-table>
      <thead>
        <tr>
          <th>NIK</th>
          <th>Nama</th>
          <th>Lokasi</th>
          <th>Total Kehadiran</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredAttendance" :key="index">
          <td>{{ item.nik }}</td>
          <td>{{ item.nama }}</td>
          <td>{{ item.lokasi }}</td>
          <td>{{ getTotalHadir(item.kehadiran) }} Hari</td>
          <td>
            <v-btn color="primary" @click="showDetail(item.id)">
              Show
            </v-btn>
            <v-btn color="primary" @click="update(item.id)">
              Update
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import BaseDialog from "../../src/components/BaseDialog.vue";
import BaseForm from "../../src/components/BaseForm.vue";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import attendanceData from "../attendance_january_2025.js";

const formData = ref({
  tanggal: "",
  project: "",
  file: null,
});

const formFieldsAdd = [
  
  // { label: "Bulan & Tahun", model: "tanggal", type: "month-year", required: true },
  { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
  { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
  { label: "Upload File", model: "file", type: "file", required: true },
];

const formDataExpor = ref({
  tanggal: "",
  project: "",
});

const formFieldsExpor = [
  
  { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
  { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
];

const submitForm = (data) => {
  console.log("Data tersimpan:", data);
};

const submitFormExpor = (data) => {
  console.log("Data tersimpan:", data);
};


const selectedDetail = ref(null);
// Fungsi menampilkan detail menggunakan dialog
const isAddAbsensiOpen = ref(false);
const isDialogExporOpen = ref(false);

const router = useRouter();
const searchNIK = ref("");
const selectedLocation = ref(null);
const locations = ["cisauk", "vbi", "sumarecon bekasi"];

const addAttendance = (item) => {
  selectedDetail.value = item;
  isDialogExporOpen.value = true;
};

// Fungsi navigasi ke halaman show berdasarkan ID
const showDetail = (id) => {
  router.push(`/attendance/${id}`);
};

const update = (id) => {
  router.push(`/attendance/update?id=${id}`);

};

// Fungsi kembali ke halaman utama absensi
const goBack = () => {
  router.push("/attendance");
};

// Hitung total kehadiran
const getTotalHadir = (kehadiran) => {
  return kehadiran.filter(k => k.status === "Hadir").length;
};

// Filter data berdasarkan NIK dan lokasi
const filteredAttendance = computed(() => {
  return attendanceData.filter(item => {
    const matchNIK = searchNIK.value ? item.nik.includes(searchNIK.value) : true;
    const matchLocation = selectedLocation.value ? item.lokasi === selectedLocation.value : true;
    return matchNIK && matchLocation;
  });
});
</script>
