<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  fields: Array,
  modelValue: Object,
  showSubmit: {
    type: Boolean,
    default: true, // Secara default tombol submit akan ditampilkan
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const formData = ref({});

// Inisialisasi data form
const initFormData = () => {
  formData.value = props.fields.reduce((acc, field) => {
    acc[field.model] = props.modelValue?.[field.model] || "";
    return acc;
  }, {});
};

// Update data saat modelValue berubah
watch(() => props.modelValue, initFormData, { deep: true, immediate: true });

// Emit perubahan ke parent
const updateField = (field, value) => {
  formData.value[field] = value;
  emit("update:modelValue", { ...formData.value });
};

// Fungsi untuk memformat tanggal ke "YYYY-MM"
const selectedDate = ref(null);
const formatMonthYear = (date) => {
  if (!date) return "";
  const formatted = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "2-digit",
  }).format(new Date(date));
  return formatted.replace("/", "-"); // Ubah format dari "02/2025" ke "2025-02"
};

const handleMonthYearSelect = (field, date) => {
  const formattedDate = formatMonthYear(date);
  updateField(field, formattedDate);
};
</script>

<template>
  <v-form @submit.prevent="emit('submit', formData)">
    <v-row>
      <v-col v-for="field in fields" :key="field.model" cols="12" md="6">
        <!-- Input Text -->
        <v-text-field
          v-if="field.type === 'text'"
          :label="field.label"
          v-model="formData[field.model]"
          :type="field.inputType || 'text'"
          :required="field.required"
          @update:modelValue="updateField(field.model, $event)"
        />

        <!-- Select -->
        <v-select
          v-else-if="field.type === 'select'"
          :label="field.label"
          v-model="formData[field.model]"
          :items="field.items"
          :required="field.required"
          @update:modelValue="updateField(field.model, $event)"
        />

        <!-- File Upload -->
        <v-file-input
          v-else-if="field.type === 'file'"
          :label="field.label"
          @change="updateField(field.model, $event.target.files[0])"
          :required="field.required"
          show-size
        />

        <!-- Input Bulan & Tahun -->
        <v-menu v-else-if="field.type === 'month-year'" v-model="selectedDate" transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              :label="field.label"
              v-model="formData[field.model]"
              readonly
              :required="field.required"
            />
          </template>
          <v-date-picker
            v-model="selectedDate"
            view-mode="month"
            color="primary"
            @update:modelValue="handleMonthYearSelect(field.model, selectedDate)"
          />
        </v-menu>
      </v-col>
    </v-row>

    <v-btn v-if="props.showSubmit" color="primary" type="submit">Submit</v-btn>
  </v-form>
</template>
