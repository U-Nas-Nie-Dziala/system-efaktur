<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { client, getAuthHeaders, type ICompanyDataBody, contract } from "../../api";

const snackbar = reactive({
    show: false,
    message: "",
    color: "success",
});

const CompanyType = {
    JDG: "Jednoosobowa działalność gospodarcza",
    SC: "Spółka cywilna",
    SPJ: "Spółka jawna",
    SPP: "Spółka partnerska",
    SPK: "Spółka komandytowa",
    SKA: "Spółka komandytowo-akcyjna",
    SPZOO: "Spółka z ograniczoną odpowiedzialnością",
    PSA: "Prosta spółka akcyjna",
    SA: "Spółka akcyjna",
    SPOLDZ: "Spółdzielnia",
    FUNDACJA: "Fundacja",
    STOWARZYSZENIE: "Stowarzyszenie rejestrowe",
    SPZOZ: "Samodzielny publiczny zakład opieki zdrowotnej",
    JEDNOSTKA_BUDZETOWA: "Jednostka budżetowa",
    ODDZIAL_ZAGR: "Oddział przedsiębiorcy zagranicznego",
    INNE: "Inna forma prawna",
};

const companyState = reactive<{
    name: string;
    select: string | null;
    nip: string;
    regon: string;
    bdo: string;
    krs: string;
    street: string;
    address: string;
    zipcode: string;
    city: string;
    country: string;
    registerDate: string | null;
    vat: boolean;
}>({
    name: "",
    select: null,
    nip: "",
    regon: "",
    bdo: "",
    krs: "",
    street: "",
    address: "",
    zipcode: "",
    city: "",
    country: "",
    registerDate: null,
    vat: false,
});

const show = ref(false);
const loading = ref(false);

const loadCompanyData = async () => {
    try {
        const response = await client.meInfo({
            headers: getAuthHeaders(),
        });
        if (response.status === 200 && response.body.company) {
            const company = response.body.company;
            companyState.name = company.name;
            companyState.select = company.type;
            companyState.nip = company.nip || "";
            companyState.regon = company.regon || "";
            companyState.bdo = company.bdo || "";
            companyState.krs = company.krs || "";
            companyState.street = company.street;
            companyState.address = company.address;
            companyState.zipcode = company.zipcode;
            companyState.city = company.city;
            companyState.country = company.country;
            companyState.registerDate = company.registerDate
                ? new Date(company.registerDate).toISOString().split("T")[0]
                : null;
            companyState.vat = Boolean(company.vat);
        }
    } catch {
        // silent
    }
};

const submit = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            showSnackbar("Brak tokenu autoryzacji. Zaloguj się ponownie.", "error");
            return;
        }
        if (!companyState.select || !companyState.registerDate) {
            showSnackbar("Uzupełnij wymagane pola.", "error");
            return;
        }
        const payload: ICompanyDataBody = {
            name: companyState.name,
            type: companyState.select,
            nip: companyState.nip,
            regon: companyState.regon,
            bdo: companyState.bdo,
            krs: companyState.krs,
            street: companyState.street,
            address: companyState.address,
            zipcode: companyState.zipcode,
            city: companyState.city,
            country: companyState.country,
            registerDate: companyState.registerDate,
            vat: companyState.vat,
        } as ICompanyDataBody;
        const validation = await contract.setCompanyData.body.safeParseAsync(payload);
        if (!validation.success) {
            showSnackbar("Sprawdź poprawność danych firmy.", "error");
            return;
        }
        const response = await client.setCompanyData({
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showSnackbar("Dane firmy zostały zaktualizowane", "success");
        } else {
            showSnackbar("Nie udało się zapisać danych firmy", "error");
        }
    } catch (error) {
        showSnackbar("Błąd podczas aktualizacji danych firmy", "error");
    } finally {
        loading.value = false;
    }
};

const showSnackbar = (message: string, color: string) => {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.show = true;
};

onMounted(() => {
    loadCompanyData();
});
</script>

<template>
    <v-row dense justify="center" class="mt-6" id="company-settings">
        <v-col cols="12" md="8">
            <v-card elevation="2" :disabled="loading">
                <v-card-title
                    class="d-flex align-center justify-space-between pa-4"
                    style="background: linear-gradient(to left, #ffb3b3, #ff8a8a, #ff6b6b, #ee5a6f); cursor: pointer"
                    @click="show = !show"
                >
                    <div>
                        <v-icon class="mr-2">mdi:mdi-domain</v-icon>
                        Ustawienia danych firmy
                    </div>
                    <v-icon :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"> </v-icon>
                </v-card-title>

                <v-divider></v-divider>

                <v-expand-transition>
                    <div v-show="show">
                        <v-divider></v-divider>

                        <v-form @submit.prevent="submit"
                            ><v-container>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="companyState.name"
                                            :counter="10"
                                            label="Nazwa firmy"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="companyState.nip"
                                            label="NIP"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select
                                            v-model="companyState.select"
                                            :items="
                                                Object.values(CompanyType).map((title) => ({
                                                    value: title,
                                                    title,
                                                }))
                                            "
                                            label="Forma prwana"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="companyState.regon"
                                            :counter="10"
                                            label="REGON"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="companyState.krs"
                                            :counter="10"
                                            label="KRS"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="companyState.bdo"
                                            :counter="10"
                                            label="BDO"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.city"
                                            :counter="10"
                                            label="Miasto"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.street"
                                            :counter="10"
                                            label="Ulica"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.address"
                                            :counter="10"
                                            label="Numer domu/lokalu"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.zipcode"
                                            :counter="10"
                                            label="Kod pocztowy"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.country"
                                            :counter="10"
                                            label="Kraj"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="companyState.registerDate"
                                            label="Data rejestracji"
                                            type="date"
                                            variant="outlined"
                                            density="compact"
                                            required
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-checkbox-btn
                                            v-model="companyState.vat"
                                            label="Czy podmiot jest czynnym podatnikiem VAT?"
                                            variant="outlined"
                                            density="compact"
                                            value="true"
                                            :true-value="true"
                                            :false-value="false"
                                            true-icon="mdi:mdi-checkbox-marked"
                                            false-icon="mdi:mdi-checkbox-blank-outline"
                                            indeterminate-icon="mdi:mdi-minus-box"
                                            required
                                        ></v-checkbox-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="d-flex justify-center pb-4">
                                <v-btn type="submit" color="#ff6b6b" variant="outlined" :loading="loading"
                                    >Zapisz zmiany</v-btn
                                >
                            </div></v-form
                        >
                    </div>
                </v-expand-transition>
            </v-card>
        </v-col>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
            {{ snackbar.message }}
            <template #actions>
                <v-btn variant="text" @click="snackbar.show = false">Zamknij</v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>
