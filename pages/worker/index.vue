  <template>
  <v-container>
    <h2>Daftar Pekerja</h2>

    <!-- Tombol Kembali -->
    <div >

    <v-btn color="secondary" @click="goBack">Kembali</v-btn>
    </div>
    <br>

    <v-row no-gutters>
      <v-col cols="7">

      </v-col>

      <v-col cols="5">
        <v-row justify="end" >
          <v-col cols="auto">
            <BaseDialog
            v-model="isAddWorkerExcellOpen"
            title=""
            buttonText="Add Pekerja Excel"
            buttonColor="danger"
            buttonVariant="tonal"
            @closed="isAddWorkerExcellOpen = false"
            >
            <h3>Tambah Pekerja By Excel</h3>
            <br>
            <h5> Sample untuk menambah Pekerja File.xslx </h5>
            <br>

            <BaseForm :fields="formFieldsAdd" v-model="formData" @submit="submitForm" />
            </BaseDialog>
          </v-col>

          

        <v-col cols="auto">
         
            <BaseDialog
            v-model="iseditMonthlyIncomeOpen"
            title=""
            buttonText="Edit Income Bulanan"
            buttonColor="danger"
            buttonVariant="tonal"
            @closed="iseditMonthlyIncomeOpen = false"
            >
            <h2>Edit Pendapatan Bulanan Pekerja  Pekerja By Excel</h2>
            <br>
            <h5> Sample untuk Edit Pendapatan Bulanan Pekerja  File.xslx </h5>
            <br>
            <BaseForm :fields="formFieldsEdit" v-model="formDataEdit" @submit="submitForm" />
            </BaseDialog>
          </v-col>

         

        </v-row>
      </v-col>
    </v-row>

    <br>
    <br>

    <!-- Filter -->
    <v-row no-gutters>
      <v-col cols="7">
  <v-row>
    <v-col cols="4" >
      <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
    </v-col>

    <v-col cols="4" >
      <v-select 
        v-model="selectedLocation" 
        label="Pilih Lokasi"
        :items="locations" 
        clearable>
      </v-select>
    </v-col>

    <!-- Kolom untuk tombol -->
    <v-col cols="4" class="d-flex align-center" style="margin-top: -20px;">
      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-col>

  </v-row>
</v-col>


      <!-- <v-col cols="7">

        <v-row >
          <v-col cols="4">
            <v-text-field v-model="searchNIK" label="Cari NIK" clearable></v-text-field>
          </v-col>
          
          <v-col cols="4">
            <v-select 
              v-model="selectedLocation" 
              label="Pilih Lokasi"
              :items="locations" 
              clearable>
            </v-select>

          </v-col>


          <v-col cols="4">
            <div>
              <v-btn type="submit" color="primary">Submit</v-btn>
            </div>
          </v-col>

        </v-row>


      </v-col> -->

      <v-col cols="5">

        <v-row justify="end">
          <v-col cols="auto">
            <v-btn color="primary" @click="addWorker()">
              Add Pekerja
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <BaseDialog
            v-model="isDialogExporOpen"
            title="Ekspor Pekerja dan Pajak"
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

    <!-- Tabel Kehadiran -->
    <v-table>
      <thead>
        <tr>
          <th>Nama Penerima</th>
          <th>NIK</th>
          <th>Status Pernikahan</th>
          <th>Total Pendapatan Bulanan</th>
          <th>Tempat Proyek</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredAttendance" :key="index">
          <td>{{ item.nama }}</td>
          <td>{{ item.nik }}</td>
          <td>{{ item.statusPtkp }}</td>
          <td>{{ item.penghasilan }}</td>
          <td>{{ item.lokasiProyek }}</td>
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
import attendanceData from "../tax_data.js";

const formData = ref({
  tanggal: "",
  project: "",
  file: null,
});

const formFieldsAdd = [
  
  { label: "Tanggal", model: "picker", type: "text", inputType: "month", required: true },
  { label: "Project", model: "project", type: "select", items: ["VBI", "Cisauk", "Sumarecon Bogor"], required: true },
  { label: "Upload File", model: "file", type: "file", required: true },
];



const formDataEdit = ref({
  tanggal: "",
  project: "",
  file: null,
});

const formFieldsEdit = [
  
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
const isAddAWorkerOpen = ref(false);
const isDialogExporOpen = ref(false);
const isAddWorkerExcellOpen = ref(false);
const iseditMonthlyIncomeOpen = ref(false);


const router = useRouter();
const searchNIK = ref("");
const selectedLocation = ref(null);
const locations = ["cisauk", "vbi", "sumarecon bekasi"];


const addAttendance = (item) => {
  selectedDetail.value = item;
  isDialogExporOpen.value = true;
};




const addWorker = () => {
  router.push(`/worker/create`);
};


// Fungsi navigasi ke halaman show berdasarkan ID
const showDetail = (id) => {
  router.push(`/worker/${id}`);
};

const update = (id) => {
  router.push(`/worker/update?id=${id}`);

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
    const matchLocation = selectedLocation.value ? item.lokasiProyek === selectedLocation.value : true;
    return matchNIK && matchLocation;
  });
});
</script>
