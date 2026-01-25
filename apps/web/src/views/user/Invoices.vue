<template>
    <v-container fluid>
        <v-row class="mb-4">
            <v-col>
                <h1 class="text-h4">Faktury</h1>
                <p class="text-subtitle-1 text-grey">Zarządzaj listą faktur</p>
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
            <v-col cols="auto" class="d-flex align-center">
                <v-btn color="#d63031" prepend-icon="mdi:mdi-plus" class="mr-2" @click="createDialog = true">
                    Dodaj fakturę
                </v-btn>
                <v-btn
                    color="error"
                    variant="outlined"
                    :disabled="selected.length === 0"
                    @click="confirmDelete(selected)"
                >
                    Usuń zaznaczone
                </v-btn>
            </v-col>
        </v-row>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="tableItems"
                :search="search"
                :loading="loading"
                show-select
                return-object
                item-value="id"
                v-model="selected"
                hover
                class="elevation-1"
            >
                <template #header.data-table-select="{ allSelected, someSelected, selectAll }">
                    <v-checkbox-btn
                        :model-value="allSelected"
                        :indeterminate="someSelected && !allSelected"
                        @update:model-value="selectAll"
                        color="primary"
                        true-icon="mdi:mdi-checkbox-marked"
                        false-icon="mdi:mdi-checkbox-blank-outline"
                        indeterminate-icon="mdi:mdi-minus-box"
                    />
                </template>

                <template #item.data-table-select="{ internalItem, isSelected, toggleSelect }">
                    <v-checkbox-btn
                        :model-value="isSelected(internalItem)"
                        @update:model-value="() => toggleSelect(internalItem)"
                        color="primary"
                        true-icon="mdi:mdi-checkbox-marked"
                        false-icon="mdi:mdi-checkbox-blank-outline"
                        indeterminate-icon="mdi:mdi-minus-box"
                    />
                </template>

                <template #item.amount="{ item }">
                    <span>{{ item.amount }}</span>
                </template>

                <template #item.status="{ item }">
                    <v-chip size="small" :color="item.statusColor" variant="tonal">
                        {{ item.status }}
                    </v-chip>
                </template>

                <template #item.actions="{ item }">
                    <v-tooltip text="Zapisz fakturę" location="top">
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                size="small"
                                variant="text"
                                :loading="savingId === item.id"
                                :disabled="!canSave(item) || savingId !== null"
                                @click="saveInvoice(item)"
                            >
                                <v-icon>mdi:mdi-content-save</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Edytuj fakturę" location="top">
                        <template #activator="{ props }">
                            <v-btn v-bind="props" size="small" variant="text" @click="openDetails(item)">
                                <v-icon>mdi:mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Usuń fakturę" location="top">
                        <template #activator="{ props }">
                            <v-btn v-bind="props" size="small" variant="text" @click="confirmDelete([item])">
                                <v-icon>mdi:mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                </template>

                <template #no-data>
                    <v-alert type="info" variant="tonal" class="ma-4">
                        Brak faktur do wyświetlenia. Dodaj pierwszą fakturę!
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="detailsDialog" fullscreen>
            <InvoiceForm
                :invoice="selectedInvoice"
                :contractors="contractors"
                :products="products"
                :company="company"
                :loading="updating"
                title="Edytuj fakturę"
                submit-label="Zapisz"
                @submit="updateInvoice"
                @close="closeDetails"
            />
        </v-dialog>

        <v-dialog v-model="createDialog" fullscreen>
            <InvoiceForm
                ref="createRef"
                :contractors="contractors"
                :products="products"
                :company="company"
                :loading="creating"
                title="Nowa faktura"
                submit-label="Dodaj"
                @submit="createInvoice"
                @close="closeCreate"
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
                    <v-btn color="error" :loading="deleting" @click="deleteInvoices">Usuń</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    client,
    getAuthHeaders,
    type IContractor,
    type IInvoice,
    type IInvoiceCreateBody,
    type IMeInfo,
    type IProduct,
} from "../../api";
import InvoiceForm from "../../components/invoices/InvoiceForm.vue";
import { useAppToast } from "../../composables/useAppToast";

type InvoiceRow = {
    id: string;
    number: string;
    issueDate: string;
    buyer: string;
    amount: string;
    status: string;
    statusColor: string;
    raw: IInvoice;
};

const loading = ref(false);
const creating = ref(false);
const updating = ref(false);
const deleting = ref(false);
const savingId = ref<string | null>(null);
const search = ref("");
const detailsDialog = ref(false);
const createDialog = ref(false);
const deleteDialog = ref(false);
const createRef = ref<InstanceType<typeof InvoiceForm> | null>(null);
const { showToast } = useAppToast();

const invoices = ref<IInvoice[]>([]);
const contractors = ref<IContractor[]>([]);
const products = ref<IProduct[]>([]);
const company = ref<IMeInfo["company"] | null>(null);

const selected = ref<InvoiceRow[]>([]);
const selectedInvoice = ref<IInvoice | null>(null);
const deleteTargets = ref<InvoiceRow[]>([]);

const headers = [
    { title: "Numer", key: "number", sortable: true },
    { title: "Data wystawienia", key: "issueDate", sortable: true },
    { title: "Nabywca", key: "buyer", sortable: true },
    { title: "Kwota", key: "amount", sortable: true },
    { title: "Status", key: "status", sortable: true },
    { title: "Akcje", key: "actions", sortable: false, align: "center" as const },
];

const formatAmount = (value: string | number | undefined, currency: string | undefined) => {
    if (!value) return "-";
    const amount = Number(value);
    const formatted = Number.isFinite(amount) ? amount.toFixed(2) : String(value);
    return `${formatted} ${currency ?? ""}`.trim();
};

const getStatus = (invoice: IInvoice) => {
    if (invoice.signed) {
        return { label: "Podpisana", color: "success" };
    }
    if (invoice.draft) {
        return { label: "Robocza", color: "warning" };
    }
    return { label: "Zapisana", color: "info" };
};

const canSave = (row: InvoiceRow) => row.raw.draft && !row.raw.signed;

const tableItems = computed<InvoiceRow[]>(() =>
    invoices.value.map((invoice) => {
        const status = getStatus(invoice);
        return {
            id: invoice.id,
            number: invoice.body?.fa?.numerFaktury ?? "-",
            issueDate: invoice.body?.fa?.dataWystawienia ?? "-",
            buyer:
                invoice.nabywca?.podmiot2?.daneIdentyfikacyjne?.nazwa ??
                invoice.nabywca?.podmiot2?.daneIdentyfikacyjne?.nip ??
                "-",
            amount: formatAmount(invoice.body?.fa?.kwotaBrutto, invoice.body?.fa?.waluta),
            status: status.label,
            statusColor: status.color,
            raw: invoice,
        };
    })
);

const fetchInvoices = async () => {
    loading.value = true;
    try {
        const response = await client.invoicesList({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            invoices.value = response.body;
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas pobierania faktur", "error");
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

const createInvoice = async (payload: IInvoiceCreateBody) => {
    creating.value = true;
    try {
        const response = await client.invoicesCreate({
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showToast("Faktura została utworzona", "success");
            await fetchInvoices();
            createRef.value?.reset();
            createDialog.value = false;
        } else if (response.status === 400) {
            const body = response.body as { message?: string };
            showToast(body.message || "Nieprawidłowe dane", "error");
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas tworzenia faktury", "error");
    } finally {
        creating.value = false;
    }
};

const openDetails = (row: InvoiceRow) => {
    selectedInvoice.value = row.raw;
    detailsDialog.value = true;
};

const closeDetails = () => {
    detailsDialog.value = false;
    selectedInvoice.value = null;
};

const closeCreate = () => {
    createDialog.value = false;
};

const updateInvoice = async (payload: IInvoiceCreateBody) => {
    if (!selectedInvoice.value) return;
    updating.value = true;
    try {
        const response = await client.invoicesUpdate({
            params: { id: selectedInvoice.value.id },
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showToast("Faktura została zaktualizowana", "success");
            await fetchInvoices();
            closeDetails();
        } else if (response.status === 400 || response.status === 404) {
            const body = response.body as { message?: string };
            showToast(body.message || "Nie udało się zaktualizować faktury", "error");
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas zapisywania", "error");
    } finally {
        updating.value = false;
    }
};

const saveInvoice = async (row: InvoiceRow) => {
    if (!canSave(row)) {
        showToast("Ta faktura została już zapisana", "info");
        return;
    }
    savingId.value = row.id;
    try {
        const response = await client.invoicesSave({
            params: { id: row.raw.id },
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showToast("Faktura została zapisana", "success");
            await fetchInvoices();
        } else {
            const body = response.body as { message?: string };
            showToast(body.message || "Nie udało się zapisać faktury", "error");
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas zapisywania faktury", "error");
    } finally {
        savingId.value = null;
    }
};

const confirmDelete = (targets: InvoiceRow[]) => {
    deleteTargets.value = targets;
    deleteDialog.value = true;
};

const deleteInvoices = async () => {
    if (!deleteTargets.value.length) return;
    deleting.value = true;
    try {
        const results = await Promise.all(
            deleteTargets.value.map((row) =>
                client.invoicesDelete({
                    params: { id: row.raw.id },
                    headers: getAuthHeaders(),
                })
            )
        );
        const failed = results.filter((result) => result.status !== 200);
        if (failed.length) {
            const message = (failed[0].body as { message?: string })?.message;
            showToast(message || "Nie udało się usunąć wszystkich faktur", "error");
        } else {
            showToast("Usunięto wybrane faktury", "success");
        }
        await fetchInvoices();
        selected.value = [];
        if (selectedInvoice.value && deleteTargets.value.some((row) => row.raw.id === selectedInvoice.value?.id)) {
            closeDetails();
        }
        deleteDialog.value = false;
        deleteTargets.value = [];
    } catch (error) {
        showToast("Wystąpił błąd podczas usuwania", "error");
    } finally {
        deleting.value = false;
    }
};

onMounted(() => {
    fetchInvoices();
    fetchContractors();
    fetchProducts();
    fetchCompany();
});
</script>
