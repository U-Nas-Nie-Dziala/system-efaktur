<template>
  <v-app>
    <v-app-bar
      app
      lass="text-h4 mb-2"
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
      <v-toolbar-title class="text-white">
        <RouterLink to="/" class="text-white text-decoration-none">
          System e-faktur
        </RouterLink>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <ThemeSwitcher />
    </v-app-bar>

    <v-main class="fill-height">
      <v-container fluid class="pa-0 fill-height">
        <router-view />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
import Footer from "../components/Footer.vue";
</script>
