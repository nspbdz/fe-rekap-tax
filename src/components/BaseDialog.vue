<template>
    <v-dialog v-model="isOpen" max-width="500">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" :color="buttonColor" :variant="buttonVariant">
          {{ buttonText }}
        </v-btn>
      </template>
  
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <slot></slot>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    title: String,
    buttonText: String,
    buttonColor: String,
    buttonVariant: String,
  });
  
  const emit = defineEmits(["closed"]);
  
  const isOpen = ref(false);
  
  const closeDialog = () => {
    isOpen.value = false;
    emit("closed");
  };
  </script>
  