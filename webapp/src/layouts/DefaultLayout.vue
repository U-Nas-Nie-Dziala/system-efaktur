<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref } from 'vue';

const placeholderLinks = ref([
  { title: "Panel glowny", icon: "mdi-view-dashboard-outline" },
  { title: "Nowa zakladka", icon: "mdi-bookmark-outline" },
  { title: "Miejsce na modul", icon: "mdi-dots-horizontal" },
]);

const drawer = ref(true);
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>eFaktur</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
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
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>