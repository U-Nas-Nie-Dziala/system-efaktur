<script setup lang="ts">
import { reactive, ref } from "vue";
const state = reactive({
  kseftoken: "",
  password: "",
});

const loading = ref(false);
const show = ref(false);

const submit = (e: Event) => {
  e.preventDefault();
  loading.value = true;
  console.log("User data changed:", state.kseftoken, state.password);
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>

<template>
  <v-row dense justify="center" class="mt-6">
    <v-col cols="12" md="8">
      <v-card elevation="2" :disabled="loading">
        <v-card-title
          class="d-flex align-center justify-space-between pa-4"
          style="
            background: linear-gradient(
              to left,
              #ffb3b3,
              #ff8a8a,
              #ff6b6b,
              #ee5a6f
            );
            cursor: pointer;
          "
          @click="show = !show"
        >
          <div>
            <v-icon class="mr-2">mdi:mdi-account</v-icon>
            Ustawienia połączenia z KSeF
          </div>
          <v-icon :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'">
          </v-icon>
        </v-card-title>

        <v-expand-transition>
          <div v-show="show">
            <!-- Zmiana danych użytkownika -->
            <v-form @submit="submit" class="pb-4">
              <div class="d-flex justify-center pt-4">
                <v-card variant="text"> </v-card>
              </div>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="state.kseftoken"
                      :counter="64"
                      label="Token KSeF"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="state.password"
                      :counter="64"
                      label="Podaj hasło"
                      variant="outlined"
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <div class="d-flex justify-center">
                <v-btn
                  type="submit"
                  color="#ff6b6b"
                  variant="outlined"
                  :loading="loading"
                  >Zapisz zmiany</v-btn
                >
              </div>
            </v-form>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
</template>
