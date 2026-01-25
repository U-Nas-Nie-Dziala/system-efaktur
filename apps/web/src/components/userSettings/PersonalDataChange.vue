<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { client, getAuthHeaders } from "../../api";

const state1 = reactive({
    firstname: "",
    lastname: "",
});

const state2 = reactive({
    currentEmail: "",
    newEmail: "",
    password: "",
});

const state3 = reactive({
    password: "",
    newPassword: "",
    confirmPassword: "",
});

const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);

const submit1 = () => {
    loading1.value = true;
    console.log("Personal data changed:", state1.firstname, state1.lastname);
    setTimeout(() => {
        loading1.value = false;
    }, 3000);
};
const submit2 = () => {
    loading2.value = true;
    console.log("Email change requested:", state2.newEmail, state2.password);
    setTimeout(() => {
        loading2.value = false;
    }, 3000);
};
const submit3 = () => {
    loading3.value = true;
    console.log("Password change requested:", state3.password, state3.newPassword);
    setTimeout(() => {
        loading3.value = false;
    }, 3000);
};

const loadingTab = [loading1, loading2, loading3];

const show = ref(false);

const loadMeInfo = async () => {
    try {
        const response = await client.meInfo({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            state1.firstname = response.body.firstname;
            state1.lastname = response.body.lastname;
            state2.currentEmail = response.body.email;
        }
    } catch {
        // silent
    }
};

onMounted(() => {
    loadMeInfo();
});
</script>

<template>
    <v-row dense justify="center" class="mt-6">
        <v-col cols="12" md="8">
            <v-card elevation="2" :disabled="loadingTab.some((l) => l.value)">
                <v-card-title
                    class="d-flex align-center justify-space-between pa-4"
                    style="background: linear-gradient(to left, #ffb3b3, #ff8a8a, #ff6b6b, #ee5a6f); cursor: pointer"
                    @click="show = !show"
                >
                    <div>
                        <v-icon class="mr-2">mdi:mdi-account</v-icon>
                        Ustawienia użytkownika
                    </div>
                    <v-icon :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"> </v-icon>
                </v-card-title>

                <v-expand-transition>
                    <div v-show="show">
                        <!-- Zmiana danych użytkownika -->
                        <v-form @submit.prevent="submit1" class="pb-4">
                            <div class="d-flex justify-center pt-4">
                                <v-card title="Zmiana danych osobowych" variant="text" density="compact"> </v-card>
                            </div>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="state1.firstname"
                                            :counter="64"
                                            label="Podaj imię"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="state1.lastname"
                                            :counter="64"
                                            label="Podaj nazwisko"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="d-flex justify-center">
                                <v-btn type="submit" color="#ff6b6b" variant="outlined" :loading="loading1"
                                    >Zapisz zmiany</v-btn
                                >
                            </div>
                        </v-form>

                        <v-divider></v-divider>

                        <!-- Zmiana email -->

                        <v-form @submit.prevent="submit2" class="pt-2 pb-4"
                            ><div class="d-flex justify-center pt-4">
                                <v-card title="Zmiana adresu e-mail" variant="text" density="compact"> </v-card>
                            </div>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="state2.currentEmail"
                                            :counter="255"
                                            label="Aktualny adres e-mail"
                                            variant="outlined"
                                            density="compact"
                                            required
                                            readonly
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="state2.newEmail"
                                            :counter="255"
                                            label="Podaj e-mail"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="state2.password"
                                            label="Zatwierdź zmiane e-maila hasłem"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="d-flex justify-center">
                                <v-btn type="submit" color="#ff6b6b" variant="outlined" :loading="loading2"
                                    >Zapisz zmiany</v-btn
                                >
                            </div>
                        </v-form>

                        <v-divider></v-divider>
                        <!-- Zmiana hasła -->
                        <v-form @submit.prevent="submit3" class="pt-4 pb-4">
                            <div class="d-flex justify-center">
                                <v-card title="Zmiana hasła" variant="text" density="compact"> </v-card>
                            </div>
                            <v-container>
                                <v-row class="ps-3 pe-3">
                                    <v-col md="4">
                                        <v-text-field
                                            v-model="state3.password"
                                            :counter="255"
                                            label="Podaj obecne hasło"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col>
                                        <v-text-field
                                            v-model="state3.newPassword"
                                            label="Podaj nowe hasło"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>

                                    <v-col>
                                        <v-text-field
                                            v-model="state3.confirmPassword"
                                            label="Potwierdź nowe hasło"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="d-flex justify-center pb-4">
                                <v-btn type="submit" color="#ff6b6b" variant="outlined" :loading="loading3"
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
