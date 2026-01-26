<template>
    <v-card>
        <v-card-title class="text-h6">Dodaj kontrahenta</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="formValid">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="contractorForm.own_name"
                            label="Nazwa własna"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="contractorForm.name"
                            label="Nazwa pełna"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.nip"
                            label="NIP"
                            :rules="[rules.required, rules.nip]"
                            variant="outlined"
                            maxlength="10"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.street"
                            label="Ulica"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.address"
                            label="Adres"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.zipcode"
                            label="Kod pocztowy"
                            :rules="[rules.required, rules.zipcode]"
                            variant="outlined"
                            maxlength="6"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.city"
                            label="Miasto"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="contractorForm.country"
                            label="Kraj"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="reset">Wyczyść</v-btn>
            <v-btn color="#d63031" :loading="loading" :disabled="!formValid" @click="submit"> Dodaj </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { VForm } from "vuetify/components";
import type { IContractorCreateBody } from "../../api";

const props = defineProps<{ loading?: boolean }>();

const emit = defineEmits<{
    (e: "create", payload: IContractorCreateBody): void;
}>();

const formValid = ref(false);
const form = ref<VForm | null>(null);

const defaultForm = {
    own_name: "",
    name: "",
    nip: "",
    street: "",
    address: "",
    zipcode: "",
    city: "",
    country: "",
};

const contractorForm = reactive({ ...defaultForm });

const rules = {
    required: (v: string) => !!v || "Pole wymagane",
    nip: (v: string) => /^\d{10}$/.test(v) || "NIP musi zawierać 10 cyfr",
    regon: (v: string) => /^\d{9}(\d{5})?$/.test(v) || "REGON musi zawierać 9 lub 14 cyfr",
    zipcode: (v: string) => /^\d{2}-?\d{3}$/.test(v) || "Nieprawidłowy format kodu pocztowego",
    email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Nieprawidłowy format email",
    phone: (v: string) => !v || /^\+?\d{9,12}$/.test(v) || "Nieprawidłowy numer telefonu (9-12 cyfr)",
};

const submit = async () => {
    const result = await form.value?.validate();
    if (!result?.valid) return;
    emit("create", {
        own_name: contractorForm.own_name,
        name: contractorForm.name,
        nip: contractorForm.nip,
        street: contractorForm.street,
        address: contractorForm.address,
        zipcode: contractorForm.zipcode,
        city: contractorForm.city,
        country: contractorForm.country,
    });
};

const reset = () => {
    Object.assign(contractorForm, defaultForm);
    form.value?.resetValidation();
    formValid.value = false;
};

defineExpose({ reset });
</script>
