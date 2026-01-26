<template>
    <v-btn @click="theme.toggle(['light', 'dark'])" icon>
        <v-icon v-if="theme.global.name.value == 'light'" icon="mdi:mdi-weather-night"></v-icon>
        <v-icon v-else icon="mdi:mdi-weather-sunny"></v-icon>
    </v-btn>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();
</script>
