<template>
  <v-container fluid class="pa-0">
    <v-card class="py-16" elevation="8">
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h1 class="text-h3 font-weight-bold mb-4">
            Witaj w Systemie E-faktur
          </h1>
          <p class="text-h6 text-medium-emphasis mb-6">
            Twoje centrum zarządzania fakturami i zadaniami
          </p>

          <v-btn
            size="large"
            color="#c0392b"
            class="text-white"
            prepend-icon="fa-solid fa-rocket"
          >
            <RouterLink
              to="/auth/login"
              class="text-white text-decoration-none"
            >
              Zaloguj się
            </RouterLink>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <v-container class="my-12">
    <v-row>
      <v-col cols="12" class="mb-8 text-center">
        <h2 class="text-h4 font-weight-bold">Główne funkcje</h2>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Odkryj możliwości naszej aplikacji
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 h-100" link>
          <v-card-text class="text-center">
            <v-icon size="64" color="#c0392b" class="mb-4">
              fa-solid fa-tasks
            </v-icon>
            <h3 class="text-h6 font-weight-bold mb-3">Zarządzanie zadaniami</h3>
            <p class="text-body-2 text-medium-emphasis">
              Organizuj swoje zadania w prosty i efektywny sposób. Śledź postępy
              i osiągaj cele szybciej.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 h-100" link>
          <v-card-text class="text-center">
            <v-icon size="64" color="#c0392b" class="mb-4">
              fa-solid fa-users
            </v-icon>
            <h3 class="text-h6 font-weight-bold mb-3">Praca zespołowa</h3>
            <p class="text-body-2 text-medium-emphasis">
              Współpracuj z zespołem w czasie rzeczywistym. Dziel się pomysłami
              i realizuj projekty wspólnie.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4 h-100" link>
          <v-card-text class="text-center">
            <v-icon size="64" color="#c0392b" class="mb-4">
              fa-solid fa-chart-line
            </v-icon>
            <h3 class="text-h6 font-weight-bold mb-3">Raporty i analityka</h3>
            <p class="text-body-2 text-medium-emphasis">
              Monitoruj postępy projektów dzięki szczegółowym raportom i
              wizualizacjom danych.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="text-center">
        <h3 class="text-h3 font-weight-bold" style="color: #c0392b">10k+</h3>
        <p class="text-body-1 text-medium-emphasis">Aktywnych użytkowników</p>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <h3 class="text-h3 font-weight-bold" style="color: #c0392b">50k+</h3>
        <p class="text-body-1 text-medium-emphasis">Zrealizowanych projektów</p>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <h3 class="text-h3 font-weight-bold" style="color: #c0392b">99%</h3>
        <p class="text-body-1 text-medium-emphasis">Zadowolonych klientów</p>
      </v-col>
      <v-col cols="12" md="3" class="text-center">
        <h3 class="text-h3 font-weight-bold" style="color: #c0392b">24/7</h3>
        <p class="text-body-1 text-medium-emphasis">Wsparcie techniczne</p>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="my-12">
    <v-card
      elevation="4"
      class="pa-8"
      style="
        background: linear-gradient(
          to right,
          #ff6b6b,
          #ee5a6f,
          #d63031,
          #c0392b
        );
      "
    >
      <v-row align="center">
        <v-col cols="12" md="8">
          <h2 class="text-h4 font-weight-bold text-white mb-2">
            Gotowy na start?
          </h2>
          <p class="text-h6 text-white">
            Dołącz do tysięcy zadowolonych użytkowników już dziś
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right text-center">
          <v-btn size="x-large" class="text-none" elevation="10">
            <RouterLink
              to="/auth/register"
              class="font-weight-medium text-decoration-none"
              style="color: #d63031"
            >
              Zarejestruj się teraz
            </RouterLink>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup></script>
