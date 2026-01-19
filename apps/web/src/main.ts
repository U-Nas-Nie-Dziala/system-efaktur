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
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

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
app.use(Toast, {
    position: "top-right",
    timeout: 6000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: false,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
});

app.mount("#app");
