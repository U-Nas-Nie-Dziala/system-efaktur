<script setup lang="ts">
const placeholderLinks = [
  { title: "Panel glowny", icon: "mdi-view-dashboard-outline" },
  { title: "Nowa zakladka", icon: "mdi-bookmark-outline" },
  { title: "Miejsce na modul", icon: "mdi-dots-horizontal" },
];
</script>

<template>
  <v-app>
    <v-app-bar color="primary" dark class="full-width-app-bar">
      <v-toolbar-title>System eFaktur</v-toolbar-title>
      <v-spacer />
      <v-btn color="white" variant="outlined" :to="{ name: 'login' }">
        Zaloguj się
      </v-btn>
    </v-app-bar>

    <div class="app-layout">
      <v-navigation-drawer
        permanent
        elevation="1"
        width="260"
        class="sidebar"
      >
        <v-list density="comfortable">
          <v-divider class="mb-2" />
          <v-list-item
            v-for="item in placeholderLinks"
            :key="item.title"
            disabled
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="bg-grey-lighten-4 content-area">
        <RouterView />
      </v-main>
    </div>
  </v-app>
</template>

<style scoped>
.full-width-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  margin-top: 64px;
}

.sidebar {
  height: calc(100vh - 64px);
}

.content-area {
  flex: 1;
  padding: 32px 16px;
}

@media (max-width: 600px) {
  .app-layout {
    flex-direction: column;
    margin-top: 56px;
  }

  .sidebar {
    height: auto;
    width: 100%;
  }
}
</style>

<style scoped>
.full-width-app-bar {
  left: 0 !important;
  width: 100% !important;
}
</style>
