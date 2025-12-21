<script setup lang="ts">
import PersonalDataChangeVue from "../../components/userSettings/PersonalDataChange.vue";
import CompanyDataChange from "../../components/userSettings/CompanyDataChange.vue";
import KsefDataChange from "../../components/userSettings/ksefDataChange.vue";
</script>

<template>
  <v-container fluid class="align-self-start py-6 px-4">
    <div class="d-flex flex-column align-center text-center">
      <div>
        <h1>Ustawienia</h1>
        <p>Tu możesz zmienić swoje ustawienia konta.</p>
      </div>
    </div>

    <personal-data-change-vue></personal-data-change-vue>

    <company-data-change></company-data-change>

    <ksef-data-change></ksef-data-change>
  </v-container>
</template>
