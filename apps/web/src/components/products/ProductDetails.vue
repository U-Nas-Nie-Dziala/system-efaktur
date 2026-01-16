<template>
    <v-card>
        <v-card-title class="text-h6">Szczegóły towaru/usługi</v-card-title>
        <v-card-text v-if="!product">
            <v-alert type="info" variant="tonal">Nie wybrano towaru/usługi.</v-alert>
        </v-card-text>
        <v-card-text v-else>
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
            <v-btn variant="text" @click="emit('close')">Zamknij</v-btn>
            <v-btn color="error" variant="text" :disabled="!product" :loading="deleting" @click="handleDelete">
                Usuń
            </v-btn>
            <v-btn color="#d63031" :disabled="!formValid || !product" :loading="saving" @click="submit"> Zapisz </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { VForm } from "vuetify/components";
import type { IProduct, IProductUpdateBody } from "../../api";

type ProductType = "PRODUCT" | "SERVICE";

const props = defineProps<{
    product: IProduct | null;
    saving?: boolean;
    deleting?: boolean;
}>();

const emit = defineEmits<{
    (e: "update", payload: IProductUpdateBody): void;
    (e: "delete", product: IProduct): void;
    (e: "close"): void;
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

watch(
    () => props.product,
    (product) => {
        if (product) {
            Object.assign(productForm, {
                name: product.name,
                description: product.description,
                type: product.type,
                unit: product.unit,
                price_netto: product.price_netto,
                price_brutto: product.price_brutto,
                vat_rate: product.vat_rate,
            });
        } else {
            Object.assign(productForm, defaultForm);
            form.value?.resetValidation();
        }
    },
    { immediate: true }
);

const submit = () => {
    if (!formValid.value || !props.product) return;
    emit("update", {
        name: productForm.name,
        description: productForm.description,
        type: productForm.type,
        unit: productForm.unit,
        price_netto: Number(productForm.price_netto),
        price_brutto: Number(productForm.price_brutto),
        vat_rate: productForm.vat_rate,
    });
};

const handleDelete = () => {
    if (!props.product) return;
    emit("delete", props.product);
};
</script>
