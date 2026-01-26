<template>
    <v-container fluid>
        <v-row class="mb-4">
            <v-col>
                <v-btn variant="text" prepend-icon="mdi:mdi-arrow-left" @click="goBack">Wróć</v-btn>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col>
                <h1 class="text-h4">Edycja faktury</h1>
                <p class="text-subtitle-1 text-grey">Edytuj dane faktury</p>
            </v-col>
        </v-row>

        <v-alert v-if="!loading && !invoice" type="info" variant="tonal" class="mb-4">
            Nie znaleziono faktury.
        </v-alert>

        <InvoiceForm
            v-if="invoice"
            :invoice="invoice"
            :contractors="contractors"
            :products="products"
            :company="company"
            :loading="saving"
            title="Edytuj fakturę"
            submit-label="Zapisz"
            @submit="updateInvoice"
            @close="goBack"
        />
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    client,
    getAuthHeaders,
    type IContractor,
    type IInvoice,
    type IInvoiceCreateBody,
    type IMeInfo,
    type IProduct,
} from "../../../api";
import InvoiceForm from "../../../components/invoices/InvoiceForm.vue";
import { useAppToast } from "../../../composables/useAppToast";

const route = useRoute();
const router = useRouter();
const { showToast } = useAppToast();

const invoice = ref<IInvoice | null>(null);
const contractors = ref<IContractor[]>([]);
const products = ref<IProduct[]>([]);
const company = ref<IMeInfo["company"] | null>(null);
const loading = ref(false);
const saving = ref(false);

const fetchInvoice = async () => {
    const id = route.params.id as string | undefined;
    if (!id) return;
    loading.value = true;
    try {
        const response = await client.invoicesFind({
            params: { id },
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            invoice.value = response.body;
        } else {
            invoice.value = null;
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas pobierania faktury", "error");
    } finally {
        loading.value = false;
    }
};

const fetchContractors = async () => {
    try {
        const response = await client.contractorsList({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            contractors.value = response.body;
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas pobierania kontrahentów", "error");
    }
};

const fetchProducts = async () => {
    try {
        const response = await client.productsList({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            products.value = response.body;
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas pobierania towarów/usług", "error");
    }
};

const fetchCompany = async () => {
    try {
        const response = await client.meInfo({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            company.value = response.body.company ?? null;
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas pobierania danych firmy", "error");
    }
};

const updateInvoice = async (payload: IInvoiceCreateBody) => {
    if (!invoice.value) return;
    saving.value = true;
    try {
        const response = await client.invoicesUpdate({
            params: { id: invoice.value.id },
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showToast("Faktura została zaktualizowana", "success");
            router.push({ name: "invoice-preview", params: { id: invoice.value.id } });
        } else if (response.status === 400 || response.status === 404) {
            const body = response.body as { message?: string };
            showToast(body.message || "Nie udało się zaktualizować faktury", "error");
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas zapisywania", "error");
    } finally {
        saving.value = false;
    }
};

const goBack = () => {
    if (invoice.value) {
        router.push({ name: "invoice-preview", params: { id: invoice.value.id } });
    } else {
        router.push({ name: "invoices" });
    }
};

watch(
    () => route.params.id,
    () => {
        fetchInvoice();
    }
);

onMounted(() => {
    fetchInvoice();
    fetchContractors();
    fetchProducts();
    fetchCompany();
});
</script>
