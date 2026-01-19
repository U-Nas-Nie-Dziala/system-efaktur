<script setup lang="ts">
import { contract } from "@repo/contract";
import { reactive, ref } from "vue";
import { client, getAuthHeaders } from "../../api";
import { useToast } from "vue-toastification";
import { ZodError } from "zod";
const state = reactive<{
    input: {
        token: string;
        password: string;
    };
    errors: {
        token: string[];
        password: string[];
    };
}>({
    input: {
        token: "",
        password: "",
    },

    errors: {
        token: [],
        password: [],
    },
});

const clearErrors = (field: "password" | "token") => {
    state.errors[field] = [];
};

const reset = () => {
    state.errors.password = [];
    state.errors.token = [];
    state.input.password = "";
    state.input.token = "";
};

const $toast = useToast();
const loading = ref(false);
const show = ref(false);

const submit = async () => {
    try {
        const data = await contract.setKsefToken.body.parseAsync(state.input);
        loading.value = true;
        const response = await client.setKsefToken({
            body: data,
            headers: getAuthHeaders(),
        });

        if (response.status == 404) {
            $toast.error(response.body.message);
        } else if (response.status == 409) {
            $toast.error(response.body.message);
        } else if (response.status == 200) {
            reset();
            $toast.success("Token został zapisany.");
        } else {
            $toast.error("Wystąpił błąd.");
        }
    } catch (e) {
        const err = e as unknown;
        console.log(err);
        if (err instanceof ZodError) {
            err.issues.forEach((v) => {
                if (v.path.join(".") === "token") {
                    state.errors.token.push(v.message);
                }

                if (v.path.join(".") === "password") {
                    state.errors.password.push(v.message);
                }
            });
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <v-row dense justify="center" class="mt-6">
        <v-col cols="12" md="8">
            <v-card elevation="2" :disabled="loading">
                <v-card-title
                    class="d-flex align-center justify-space-between pa-4"
                    style="background: linear-gradient(to left, #ffb3b3, #ff8a8a, #ff6b6b, #ee5a6f); cursor: pointer"
                    @click="show = !show"
                >
                    <div>
                        <v-icon class="mr-2">mdi:mdi-account</v-icon>
                        Ustawienia połączenia z KSeF
                    </div>
                    <v-icon :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"> </v-icon>
                </v-card-title>

                <v-expand-transition>
                    <div v-show="show">
                        <!-- Zmiana danych użytkownika -->
                        <v-form @submit.prevent="submit" class="pb-4">
                            <div class="d-flex justify-center pt-4">
                                <v-card variant="text"> </v-card>
                            </div>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="state.input.token"
                                            :error="state.errors.token.length > 0"
                                            :error-messages="state.errors.token"
                                            @update:model-value="clearErrors('token')"
                                            type="password"
                                            :counter="256"
                                            label="Token KSeF"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="state.input.password"
                                            :error="state.errors.password.length > 0"
                                            :error-messages="state.errors.password"
                                            @update:model-value="clearErrors('password')"
                                            :counter="64"
                                            type="password"
                                            label="Podaj hasło"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="d-flex justify-center">
                                <v-btn type="submit" color="#ff6b6b" variant="outlined" :loading="loading"
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
