<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import Footer from "../components/Footer.vue";
import ThemeSwitcher from "../components/ThemeSwitcher.vue";

const placeholderLinks = ref([
  { title: "Panel glowny", icon: "mdi:mdi-view-dashboard-outline" },
  { title: "Nowa zakladka", icon: "mdi:mdi-bookmark-outline" },
  { title: "Miejsce na modul", icon: "mdi:mdi-dots-horizontal" },
]);

const drawer = ref(true);
</script>

<template>
  <v-app>
    <v-app-bar
      app
      class="text-h4 mb-2"
      density="compact"
      elevation="10"
      style="
        background: linear-gradient(
          to left,
          #ff6b6b,
          #ee5a6f,
          #d63031,
          #c0392b
        );
      "
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="text-white"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-white">System e-Faktur</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi:mdi-account-circle" class="text-white"> </v-btn>
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
          link
        ></v-list-item>
      </v-list>
      <ThemeSwitcher />
    </v-navigation-drawer>

    <v-main>
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
