import { createApp } from "vue";
import "vuetify/styles/main.sass";
import { createVuetify } from "vuetify";
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import App from "./App.vue";
import { router } from "./router";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

app.use(router);
app.use(vuetify);

app.mount("#app");
