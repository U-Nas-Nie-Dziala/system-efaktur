<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import Footer from "../components/Footer.vue";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
import { useSocketStore } from "../stores/socketStore";
import OpenSessionModal from "../components/OpenSessionModal.vue";
import { client, getAuthHeaders } from "../api";

const placeholderLinks = [
    {
        title: "Panel glowny",
        icon: "mdi:mdi-view-dashboard-outline",
        name: "home",
    },
    { title: "Faktury", icon: "mdi:mdi-file-document", name: "invoices" },
    { title: "Kontrahenci", icon: "mdi:mdi-account-group", name: "clients" },
    {
        title: "Towary i usługi",
        icon: "mdi:mdi-package-variant",
        name: "products",
    },
    { title: "Ustawienia", icon: "mdi:mdi-cog-outline", name: "settings" },
];

const drawer = ref(true);
const router = useRouter();
const socketStore = useSocketStore();

const ksefSessionState = computed(() => {
    return socketStore.$state.session;
});

const logout = () => {
    socketStore.tryDisconnect();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push({ name: "login" });
};

const closeSession = async () => {
    const res = await client.ksefCloseSession({
        headers: getAuthHeaders(),
    });

    console.log(res);
};

onMounted(() => {
    if (!socketStore.$state.server?.connected) {
        socketStore.tryConnect();
    }
});
</script>

<template>
    <v-app>
        <v-app-bar
            app
            class="text-h4 mb-2"
            density="compact"
            elevation="10"
            style="background: linear-gradient(to left, #ff6b6b, #ee5a6f, #d63031, #c0392b)"
        >
            <v-app-bar-nav-icon @click="drawer = !drawer" class="text-white"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-white">System e-Faktur</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu location="bottom end">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi:mdi-account-circle" class="text-white"></v-btn>
                </template>
                <v-list density="compact">
                    <OpenSessionModal />
                    <v-list-item prepend-icon="mdi:mdi-logout" title="Wyloguj" @click="logout" />
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app>
            <v-list nav density="compact">
                <v-list-item
                    v-for="link in placeholderLinks"
                    :key="link.title"
                    :prepend-icon="link.icon"
                    :title="link.title"
                    :value="link.title"
                    class="cursor-pointer"
                    :to="{ name: link.name }"
                ></v-list-item>
            </v-list>
            <ThemeSwitcher />
        </v-navigation-drawer>

        <v-main class="fill-height">
            <v-card v-if="ksefSessionState.open" variant="tonal" color="warning">
                <v-alert
                    variant="tonal"
                    color="warning"
                    icon="mdi:mdi-information"
                    :title="`Sesja ważna do: ${new Date(ksefSessionState.validUntil!).toLocaleString()}`"
                    text="Sesja interaktywna systemu KSeF jest otwarta. Możesz bezpiecznie podpisywać i przesyłać faktury do KSeF."
                />

                <v-card-actions class="d-flex flex-row justify-end">
                    <v-btn @click="closeSession" text="Zamknij sesję" />
                </v-card-actions>
            </v-card>

            <v-container fluid>
                <RouterView />
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>

<style scoped>
.v-navigation-drawer .v-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
}
</style>
