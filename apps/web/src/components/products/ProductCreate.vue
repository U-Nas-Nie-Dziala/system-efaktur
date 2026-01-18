<template>
    <v-card>
        <v-card-title class="text-h6">Dodaj towar/usługę</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="formValid">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="productForm.name"
                            label="Nazwa"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="64"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select
                            v-model="productForm.type"
                            :items="productTypes"
                            label="Typ"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-textarea
                            v-model="productForm.description"
                            label="Opis"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="256"
                            counter
                            rows="3"
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="productForm.unit"
                            label="Jednostka"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="16"
                            counter
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="productForm.price_netto"
                            label="Cena netto"
                            :rules="[rules.required, rules.price]"
                            variant="outlined"
                            type="number"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model.number="productForm.price_brutto"
                            label="Cena brutto"
                            :rules="[rules.required, rules.price]"
                            variant="outlined"
                            type="number"
                        />
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="productForm.vat_rate"
                            label="Stawka VAT"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="4"
                            counter
                            placeholder="23"
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
import type { IProductCreateBody } from "../../api";
import { contract } from "../../api";

type ProductType = "PRODUCT" | "SERVICE";

const props = defineProps<{ loading?: boolean }>();

const emit = defineEmits<{
    (e: "create", payload: IProductCreateBody): void;
}>();

const formValid = ref(false);
const form = ref<VForm | null>(null);

const productTypes = [
    { title: "Towar", value: "PRODUCT" },
    { title: "Usługa", value: "SERVICE" },
];

const defaultForm = {
    name: "",
    description: "",
    type: "PRODUCT" as ProductType,
    unit: "szt",
    price_netto: 0,
    price_brutto: 0,
    vat_rate: "23",
};

const productForm = reactive({ ...defaultForm });

const rules = {
    required: (v: string | number) => (v !== null && v !== undefined && v !== "") || "Pole wymagane",
    price: (v: number) => v >= 0 || "Cena nie może być ujemna",
};

const submit = async () => {
    const result = await form.value?.validate();
    if (!result?.valid) return;
    const payload: IProductCreateBody = {
        name: productForm.name,
        description: productForm.description,
        type: productForm.type,
        unit: productForm.unit,
        price_netto: Number(productForm.price_netto),
        price_brutto: Number(productForm.price_brutto),
        vat_rate: productForm.vat_rate,
    };
    const validation = await contract.productsCreate.body.safeParseAsync(payload);
    if (!validation.success) {
        return;
    }
    emit("create", payload);
};

const reset = () => {
    Object.assign(productForm, defaultForm);
    form.value?.resetValidation();
    formValid.value = false;
};

defineExpose({ reset });
</script>
