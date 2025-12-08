<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
});
const loading = ref(false);

const submit = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  loading.value = false;
  router.push("/auth/login");
};
</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card
          class="px-8 py-10 auth-card rounded-lg"
          elevation="3"
          max-width="640"
          width="100%"
        >
          <div class="mb-6 text-center">
            <h1 class="text-h5 mb-1">Załóż konto</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Wypełnij wszystkie pola, aby rozpocząć pracę w systemie eFaktur.
            </p>
          </div>

          <v-form @submit.prevent="submit">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstname"
                  label="Imię"
                  autocomplete="given-name"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.lastname"
                  label="Nazwisko"
                  autocomplete="family-name"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Adres e-mail"
                  type="email"
                  autocomplete="email"
                  required
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.password"
                  label="Hasło"
                  type="password"
                  autocomplete="new-password"
                  required
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-btn
              block
              style="background-color: #d63031; color: white"
              type="submit"
              class="mt-6"
              :loading="loading"
            >
              Zarejestruj się
            </v-btn>
          </v-form>

          <p class="text-body-2 text-medium-emphasis mt-6 text-center">
            Masz już konto?
            <RouterLink
              to="/auth/login"
              class="font-weight-medium text-decoration-none"
            >
              Przejdź do logowania
            </RouterLink>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
