<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ILoginBody, client, contract } from "../../api";

const router = useRouter();
const form = ref<ILoginBody>({
    email: "",
    password: "",
    // remember: false,
});
const loading = ref(false);
const alert = ref<string | null>(null);
const fieldErrors = ref<{ email?: string; password?: string }>({});

const submit = async () => {
    alert.value = null;
    fieldErrors.value = {};

    const validation = await contract.loginAccount.body.safeParseAsync(form.value);

    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        fieldErrors.value = {
            email: errors.email?.[0],
            password: errors.password?.[0],
        };
        alert.value = "Sprawdź poprawność danych logowania.";
        return;
    }

    loading.value = true;
    const res = await client.loginAccount({ body: form.value });
    loading.value = false;

    if (res.status == 200) {
        localStorage.setItem("access_token", res.body.access_token);
        localStorage.setItem("refresh_token", res.body.refresh_token);
        router.push({ name: "home" });
        return;
    }
    if (res.status === 400 || res.status === 404) {
        const body = res.body as { message?: string };
        alert.value = body.message || "Nieprawidłowy email lub hasło.";
        return;
    }

    alert.value = "Nie udało się zalogować. Spróbuj ponownie.";
};
</script>

<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="12" md="6" lg="4">
                <v-card class="px-10 py-10 auth-card rounded-lg" elevation="8" width="100%">
                    <div class="mb-6 text-center">
                        <h1 class="text-h5 mb-1">Zaloguj się</h1>
                        <p class="text-body-2 text-medium-emphasis mb-0">
                            Podaj swoje dane logowania, aby kontynuować.
                        </p>
                    </div>

                    <v-form @submit.prevent="submit">
                        <v-alert v-if="alert" type="error" variant="tonal" class="mb-4">
                            {{ alert }}
                        </v-alert>
                        <v-text-field
                            v-model="form.email"
                            label="Adres e-mail"
                            type="email"
                            autocomplete="email"
                            required
                            variant="outlined"
                            :error-messages="fieldErrors.email"
                        />
                        <v-text-field
                            v-model="form.password"
                            label="Hasło"
                            type="password"
                            autocomplete="current-password"
                            required
                            variant="outlined"
                            :error-messages="fieldErrors.password"
                        />
                        <!-- <v-checkbox v-model="form.remember" label="Zapamiętaj mnie" density="comfortable" /> -->

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
                        <RouterLink :to="{ name: 'register' }" class="font-weight-medium text-decoration-none">
                            Zarejestruj się
                        </RouterLink>
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
