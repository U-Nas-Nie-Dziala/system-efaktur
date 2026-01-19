<template>
    <v-container fluid>
        <v-row class="mb-4">
            <v-col>
                <h1 class="text-h4">Towary i usługi</h1>
                <p class="text-subtitle-1 text-grey">Zarządzaj listą produktów i usług</p>
            </v-col>
            <v-col cols="auto" class="d-flex align-center">
                <v-btn color="error" variant="text" :disabled="selected.length === 0" @click="confirmDelete(selected)">
                    Usuń zaznaczone
                </v-btn>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col cols="12" md="4">
                <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi:mdi-magnify"
                    label="Szukaj..."
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                />
            </v-col>
            <v-col cols="12" md="3">
                <v-select
                    v-model="filterType"
                    :items="productTypes"
                    label="Typ"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                />
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col cols="12">
                <ProductCreate ref="createRef" :loading="creating" @create="createProduct" />
            </v-col>
        </v-row>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="filteredProducts"
                :search="search"
                :loading="loading"
                show-select
                return-object
                item-value="id"
                v-model:selected="selected"
                hover
                class="elevation-1"
            >
                <!-- Template do customowego formatowania komórek działa razem z #items i #no-data to jest poprawnie -->
                <template #item.type="{ item }">
                    <v-chip :color="item.type === 'PRODUCT' ? 'primary' : 'secondary'" size="small">
                        {{ formatType(item.type) }}
                    </v-chip>
                </template>

                <template #item.prices="{ item }">
                    <div class="text-no-wrap">
                        <div class="font-weight-medium">{{ formatCurrency(item.price_brutto) }}</div>
                        <div class="text-caption text-grey">Netto: {{ formatCurrency(item.price_netto) }}</div>
                    </div>
                </template>

                <template #item.actions="{ item }">
                    <v-btn size="small" variant="text" @click="openDetails(item)">
                        <v-icon>mdi:mdi-eye</v-icon>
                    </v-btn>
                    <v-btn size="small" variant="text" @click="confirmDelete([item])">
                        <v-icon>mdi:mdi-delete</v-icon>
                    </v-btn>
                </template>

                <template #no-data>
                    <v-alert type="info" variant="tonal" class="ma-4">
                        Brak produktów/usług do wyświetlenia. Dodaj pierwszy wpis!
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="detailsDialog" max-width="900">
            <ProductDetails
                :product="selectedProduct"
                :saving="updating"
                :deleting="deleting"
                @close="closeDetails"
                @update="updateProduct"
                @delete="confirmDelete([$event])"
            />
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card>
                <v-card-title class="text-h6">Potwierdź usunięcie</v-card-title>
                <v-card-text>
                    Czy na pewno chcesz usunąć {{ deleteTargets.length }} element(ów)? Ta operacja jest nieodwracalna.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="deleteDialog = false">Anuluj</v-btn>
                    <v-btn color="error" :loading="deleting" @click="deleteProducts">Usuń</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
            {{ snackbar.message }}
            <template #actions>
                <v-btn variant="text" @click="snackbar.show = false">Zamknij</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { client, getAuthHeaders, type IProduct } from "../../api";
import ProductCreate from "../../components/products/ProductCreate.vue";
import ProductDetails from "../../components/products/ProductDetails.vue";

const loading = ref(false);
const creating = ref(false);
const updating = ref(false);
const deleting = ref(false);
const search = ref("");
const filterType = ref<"PRODUCT" | "SERVICE" | null>(null);
const detailsDialog = ref(false);
const deleteDialog = ref(false);
const createRef = ref<InstanceType<typeof ProductCreate> | null>(null);

const products = ref<IProduct[]>([]);
const selected = ref<IProduct[]>([]);
const selectedProduct = ref<IProduct | null>(null);
const deleteTargets = ref<IProduct[]>([]);

const productTypes = [
    { title: "Towar", value: "PRODUCT" },
    { title: "Usługa", value: "SERVICE" },
];

const headers = [
    { title: "Nazwa", key: "name", sortable: true },
    { title: "Typ", key: "type", sortable: true },
    { title: "Jednostka", key: "unit", sortable: true },
    { title: "Ceny", key: "prices", sortable: false },
    { title: "VAT", key: "vat_rate", sortable: true },
    { title: "Opis", key: "description", sortable: false },
    { title: "Akcje", key: "actions", sortable: false, align: "center" as const },
];

const snackbar = reactive({
    show: false,
    message: "",
    color: "success",
});

const fetchProducts = async () => {
    loading.value = true;
    try {
        const response = await client.productsList({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            products.value = response.body;
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas pobierania danych", "error");
    } finally {
        loading.value = false;
    }
};

const createProduct = async (payload: Parameters<typeof client.productsCreate>[0]["body"]) => {
    creating.value = true;
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            showSnackbar("Brak tokenu autoryzacji. Zaloguj się ponownie.", "error");
            return;
        }
        const response = await client.productsCreate({
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showSnackbar("Produkt/usługa została dodana", "success");
            await fetchProducts();
            createRef.value?.reset();
        } else if (response.status === 400) {
            const body = response.body as { message?: string };
            showSnackbar(body.message || "Nieprawidłowe dane", "error");
        } else if (response.status === 401 || response.status === 403) {
            showSnackbar("Brak uprawnień. Zaloguj się ponownie.", "error");
        } else {
            showSnackbar("Nie udało się dodać produktu/usługi", "error");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas dodawania", "error");
    } finally {
        creating.value = false;
    }
};

const openDetails = (product: IProduct) => {
    selectedProduct.value = product;
    detailsDialog.value = true;
};

const closeDetails = () => {
    detailsDialog.value = false;
    selectedProduct.value = null;
};

const updateProduct = async (payload: Parameters<typeof client.productsUpdate>[0]["body"]) => {
    if (!selectedProduct.value) return;
    updating.value = true;
    try {
        const response = await client.productsUpdate({
            params: { id: selectedProduct.value.id },
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showSnackbar("Produkt/usługa została zaktualizowana", "success");
            await fetchProducts();
        } else if (response.status === 404) {
            showSnackbar("Nie znaleziono wpisu", "error");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas zapisywania", "error");
    } finally {
        updating.value = false;
    }
};

const confirmDelete = (targets: IProduct[]) => {
    deleteTargets.value = targets;
    deleteDialog.value = true;
};

const deleteProducts = async () => {
    if (!deleteTargets.value.length) return;
    deleting.value = true;
    try {
        await Promise.all(
            deleteTargets.value.map((product) =>
                client.productsDelete({
                    params: { id: product.id },
                    headers: getAuthHeaders(),
                })
            )
        );
        showSnackbar("Usunięto wybrane elementy", "success");
        await fetchProducts();
        selected.value = [];
        deleteDialog.value = false;
        deleteTargets.value = [];
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas usuwania", "error");
    } finally {
        deleting.value = false;
    }
};

const filteredProducts = computed(() => {
    if (!filterType.value) return products.value;
    return products.value.filter((p: IProduct) => p.type === filterType.value);
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);
};

const formatType = (type: "PRODUCT" | "SERVICE") => (type === "PRODUCT" ? "Towar" : "Usługa");

const showSnackbar = (message: string, color: string) => {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.show = true;
};

onMounted(() => {
    fetchProducts();
});
</script>
