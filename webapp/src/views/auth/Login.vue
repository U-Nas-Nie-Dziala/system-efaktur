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
  router.push("/");
};
</script>

<template>
  <v-container class="auth-wrapper" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-sheet class="px-8 py-10" elevation="3" max-width="480" width="100%">
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
              color="primary"
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
              to="/auth/register"
              class="font-weight-medium text-primary text-decoration-none"
            >
              Zarejestruj się
            </RouterLink>
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
