<template>
    <v-app>
        <v-app-bar
            app
            class="text-h4 mb-2"
            density="compact"
            elevation="10"
            style="background: linear-gradient(to left, #ff6b6b, #ee5a6f, #d63031, #c0392b)"
        >
            <v-toolbar-title class="text-white">System e-faktur</v-toolbar-title>

            <v-spacer></v-spacer>

            <ThemeSwitcher />
        </v-app-bar>

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
        <Footer />
    </v-app>
</template>

<script setup lang="ts">
import ThemeSwitcher from "../components/ThemeSwitcher.vue";
import Footer from "../components/Footer.vue";
</script>
