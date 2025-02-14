// plugins/vuetify.ts
import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles"; // Tambahkan style Vuetify

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi', // Gunakan Material Design Icons (MDI)
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
