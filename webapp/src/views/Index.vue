<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  { icon: 'mdi-file-document', title: 'Faktury', value: '0', color: 'primary' },
  { icon: 'mdi-account-group', title: 'Kontrahenci', value: '0', color: 'success' },
  { icon: 'mdi-currency-usd', title: 'Przychody', value: '0 zł', color: 'info' },
  { icon: 'mdi-clock-outline', title: 'Oczekujące', value: '0', color: 'warning' },
]);

const quickActions = ref([
  { icon: 'mdi-plus-circle', title: 'Nowa faktura', color: 'primary' },
  { icon: 'mdi-account-plus', title: 'Dodaj kontrahenta', color: 'success' },
  { icon: 'mdi-file-chart', title: 'Raporty', color: 'info' },
  { icon: 'mdi-cog', title: 'Ustawienia', color: 'secondary' },
]);

const recentInvoices = ref([]);
</script>

<template>
  <div>
    <!-- Nagłówek powitalny -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="pa-6 bg-gradient-primary" elevation="3">
          <v-card-title class="text-h4 text-white mb-2">
            Witamy w systemie eFaktur!
          </v-card-title>
          <v-card-subtitle class="text-white opacity-90">
            Zarządzaj swoimi fakturami w prosty i intuicyjny sposób
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statystyki -->
    <v-row class="mb-6">
      <v-col 
        v-for="stat in stats" 
        :key="stat.title" 
        cols="12" 
        sm="6" 
        md="3"
      >
        <v-card elevation="2" hover class="h-100">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 mb-1">{{ stat.value }}</div>
                <div class="text-caption text-medium-emphasis">{{ stat.title }}</div>
              </div>
              <v-avatar :color="stat.color" size="56">
                <v-icon size="32" color="white">{{ stat.icon }}</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Szybkie akcje -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Szybkie akcje
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col 
                v-for="action in quickActions" 
                :key="action.title" 
                cols="6" 
                sm="3"
              >
                <v-card 
                  :color="action.color" 
                  variant="tonal" 
                  hover 
                  class="text-center pa-4"
                  style="cursor: pointer;"
                >
                  <v-icon size="48" :color="action.color">{{ action.icon }}</v-icon>
                  <div class="text-caption mt-2">{{ action.title }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ostatnie faktury i Powiadomienia -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <v-icon class="mr-2">mdi-file-document-multiple</v-icon>
              Ostatnie faktury
            </div>
            <v-btn variant="text" color="primary" size="small">
              Zobacz wszystkie
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="recentInvoices.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-file-document-outline</v-icon>
              <div class="text-h6 mt-4 text-medium-emphasis">Brak faktur</div>
              <div class="text-caption text-medium-emphasis">
                Rozpocznij od utworzenia pierwszej faktury
              </div>
              <v-btn color="primary" class="mt-4" prepend-icon="mdi-plus">
                Utwórz fakturę
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-bell</v-icon>
            Powiadomienia
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1">mdi-bell-outline</v-icon>
              <div class="text-caption mt-4 text-medium-emphasis">
                Brak nowych powiadomień
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Przydatne linki -->
        <v-card elevation="2" class="mt-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-link-variant</v-icon>
            Przydatne linki
          </v-card-title>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-help-circle" title="Pomoc"></v-list-item>
            <v-list-item prepend-icon="mdi-book-open-variant" title="Dokumentacja"></v-list-item>
            <v-list-item prepend-icon="mdi-phone" title="Kontakt"></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.opacity-90 {
  opacity: 0.9;
}

.h-100 {
  height: 100%;
}
</style>