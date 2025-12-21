<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  email: "",
  password: "",
  remember: false,
});
const loading = ref(false);

const submit = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  loading.value = false;
  router.push("/user/home");
};
</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card
          class="px-10 py-10 auth-card rounded-lg"
          elevation="8"
          width="100%"
        >
          <div class="mb-6 text-center">
            <h1 class="text-h5 mb-1">Zaloguj się</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Podaj swoje dane logowania, aby kontynuować.
            </p>
          </div>

          <v-form @submit.prevent="submit">
            <v-text-field
              v-model="form.email"
              label="Adres e-mail"
              type="email"
              autocomplete="email"
              required
              variant="outlined"
            />
            <v-text-field
              v-model="form.password"
              label="Hasło"
              type="password"
              autocomplete="current-password"
              required
              variant="outlined"
            />
            <v-checkbox
              v-model="form.remember"
              label="Zapamiętaj mnie"
              density="comfortable"
            />

            <v-btn
              block
              style="background-color: #d63031; color: white"
              type="submit"
              class="mt-4"
              :loading="loading"
            >
              Zaloguj się
            </v-btn>
          </v-form>

          <p class="text-body-2 text-medium-emphasis mt-6 text-center">
            Nie masz konta?
            <RouterLink
              :to="{ name: 'register' }"
              class="font-weight-medium text-decoration-none"
            >
              Zarejestruj się
            </RouterLink>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
