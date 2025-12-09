<script setup lang="ts">
import { ref } from "vue";

const stats = ref([
  {
    icon: "mdi:mdi-file-document",
    title: "Faktury",
    value: "0",
    color: "#ff6b6b",
  },
  {
    icon: "mdi:mdi-account-group",
    title: "Kontrahenci",
    value: "0",
    color: "#ee5a6f",
  },
  {
    icon: "mdi:mdi-currency-usd",
    title: "Przychody",
    value: "0 zł",
    color: "#d63031",
  },
  {
    icon: "mdi:mdi-clock-outline",
    title: "Oczekujące",
    value: "0",
    color: "#c0392b",
  },
]);

const quickActions = ref([
  { icon: "mdi:mdi-plus-circle", title: "Nowa faktura", color: "#ff6b6b" },
  {
    icon: "mdi:mdi-account-plus",
    title: "Dodaj kontrahenta",
    color: "#ee5a6f",
  },
  { icon: "mdi:mdi-file-chart", title: "Raporty", color: "#d63031" },
  { icon: "mdi:mdi-cog", title: "Ustawienia", color: "#c0392b" },
]);

const recentInvoices = ref([]);
</script>

<template>
  <v-container fluid>
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card
          class="pa-6"
          style="
            background: linear-gradient(
              to left,
              #ffb3b3,
              #ff8a8a,
              #ff6b6b,
              #ee5a6f
            );
          "
          elevation="3"
        >
          <v-card-title class="text-h4 text-white mb-2">
            Witamy w systemie eFaktur!
          </v-card-title>
          <v-card-subtitle class="text-white opacity-90">
            Zarządzaj swoimi fakturami w prosty i intuicyjny sposób
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card elevation="2" hover class="h-100">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 mb-1">{{ stat.value }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ stat.title }}
                </div>
              </div>
              <v-avatar :color="stat.color" size="56">
                <v-icon size="32" color="white">{{ stat.icon }}</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center"
            style="
              background: linear-gradient(
                to left,
                #ffb3b3,
                #ff8a8a,
                #ff6b6b,
                #ee5a6f
              );
            "
          >
            <v-icon class="mr-2">mdi:mdi-lightning-bolt</v-icon>
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
                  style="cursor: pointer"
                >
                  <v-icon size="48" :color="action.color">{{
                    action.icon
                  }}</v-icon>
                  <div class="text-caption mt-2">{{ action.title }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="
              background: linear-gradient(
                to left,
                #ffb3b3,
                #ff8a8a,
                #ff6b6b,
                #ee5a6f
              );
            "
          >
            <div>
              <v-icon class="mr-2">mdi:mdi-file-document-multiple</v-icon>
              Ostatnie faktury
            </div>
            <v-btn variant="text" style="color: #d63031" size="small">
              Zobacz wszystkie
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="recentInvoices.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1"
                >mdi:mdi-file-document-outline</v-icon
              >
              <div class="text-h6 mt-4 text-medium-emphasis">Brak faktur</div>
              <div class="text-caption text-medium-emphasis">
                Rozpocznij od utworzenia pierwszej faktury
              </div>
              <v-btn color="#d63031" class="mt-4" prepend-icon="mdi:mdi-plus">
                Utwórz fakturę
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center"
            style="background: linear-gradient(to left, #ffb3b3)"
          >
            <v-icon class="mr-2">mdi:mdi-bell</v-icon>
            Powiadomienia
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1"
                >mdi:mdi-bell-outline</v-icon
              >
              <div class="text-caption mt-4 text-medium-emphasis">
                Brak nowych powiadomień
              </div>
            </div>
          </v-card-text>
        </v-card>
        <v-card elevation="2" class="mt-4">
          <v-card-title
            class="d-flex align-center"
            style="background: linear-gradient(to left, #ffb3b3)"
          >
            <v-icon class="mr-2">mdi:mdi-chart-bar</v-icon>
            Statystyki
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1"
                >mdi:mdi-chart-bar-stacked</v-icon
              >
              <div class="text-caption mt-4 text-medium-emphasis">
                Statystyki wkrótce dostępne
              </div>
            </div>
          </v-card-text>
        </v-card>
        <v-card elevation="2" class="mt-4">
          <v-card-title
            class="d-flex align-center"
            style="background: linear-gradient(to left, #ffb3b3)"
          >
            <v-icon class="mr-2">mdi:mdi-link-variant</v-icon>
            Przydatne linki
          </v-card-title>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi:mdi-help-circle"
              title="Pomoc"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi:mdi-book-open-variant"
              title="Dokumentacja"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi:mdi-phone"
              title="Kontakt"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.opacity-90 {
  opacity: 0.9;
}

.h-100 {
  height: 100%;
}
</style>
