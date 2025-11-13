<template>
  <v-app>
    <v-main class="bg-grey-lighten-4 auth-content">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}
</style>
