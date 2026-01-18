import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "vuetify/styles/main.sass";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import App from "./App.vue";
import { router } from "./router";
import { pinia } from "./stores";

const app = createApp(App);

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "dark",
    },
    icons: {
        defaultSet: "fa",
        aliases,
        sets: {
            fa,
            mdi,
        },
    },
});

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
