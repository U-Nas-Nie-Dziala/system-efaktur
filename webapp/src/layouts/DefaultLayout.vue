<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const placeholderLinks = ref([
  { title: "Panel glowny", icon: "mdi-view-dashboard-outline" },
  { title: "Nowa zakladka", icon: "mdi-bookmark-outline" },
  { title: "Miejsce na modul", icon: "mdi-dots-horizontal" },
]);

const drawer = ref(true);
const theme = useTheme();

</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>System e-Faktur</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list nav density="compact">
        <v-list-item 
          v-for="link in placeholderLinks"
          :key="link.title"
          :prepend-icon="link.icon" 
          :title="link.title" 
          :value="link.title"
          link
        ></v-list-item>
      </v-list>
      <v-btn @click="theme.toggle(['light', 'dark'])" icon>
        <v-icon v-if="theme.global.name.value == 'light'">mdi-weather-night</v-icon>
        <v-icon v-else>mdi-weather-sunny</v-icon>
      </v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
  .v-list-item {
    cursor: pointer;
    border: 2px solid #EEEEEE;
  }

  .v-navigation-drawer {
    border-right: 2px solid #EEEEEE;
  }

  .v-navigation-drawer .v-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
</style>