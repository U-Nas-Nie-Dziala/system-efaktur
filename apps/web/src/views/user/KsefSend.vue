<template>
    <v-container fluid>
        <v-row class="mb-4">
            <v-col>
                <h1 class="text-h4">Wysyłka KSeF</h1>
                <p class="text-subtitle-1 text-grey">Lista faktur gotowych do wysyłki</p>
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
        </v-row>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="tableItems"
                :search="search"
                :loading="loading"
                item-value="id"
                hover
                class="elevation-1"
            >
                <template #item.status="{ item }">
                    <v-chip size="small" :color="item.statusColor" variant="tonal">
                        {{ item.status }}
                    </v-chip>
                </template>

                <template #item.actions="{ item }">
                    <v-tooltip text="Podgląd" location="top">
                        <template #activator="{ props }">
                            <v-btn v-bind="props" size="small" variant="text" @click="openPreview(item)">
                                <v-icon>mdi:mdi-eye</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Wyślij do KSeF" location="top">
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                size="small"
                                variant="text"
                                :loading="sendingId === item.id"
                                :disabled="
                                    !canSend(item) || gettingUpo !== null || signingId !== null || sendingId !== null
                                "
                                @click="sendInvoice(item)"
                            >
                                <v-icon>mdi:mdi-send</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Pobierz UPO" location="top">
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                size="small"
                                variant="text"
                                :loading="sendingId === item.id"
                                :disabled="
                                    !canGetUpo(item) || gettingUpo !== null || signingId !== null || sendingId !== null
                                "
                                @click="getUPO(item)"
                            >
                                <v-icon>mdi:mdi-send</v-icon>
                            </v-btn>
                        </template>
                    </v-tooltip>
                </template>

                <template #no-data>
                    <v-alert type="info" variant="tonal" class="ma-4"> Brak faktur do wysyłki. </v-alert>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="previewDialog" max-width="720">
            <v-card>
                <v-card-title>Podgląd faktury</v-card-title>
                <v-divider />
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="text-caption text-grey">Numer</div>
                            <div class="text-subtitle-1">{{ previewItem?.number }}</div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="text-caption text-grey">Data wystawienia</div>
                            <div class="text-subtitle-1">{{ previewItem?.issueDate }}</div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="text-caption text-grey">Nabywca</div>
                            <div class="text-subtitle-1">{{ previewItem?.buyer }}</div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="text-caption text-grey">Kwota</div>
                            <div class="text-subtitle-1">{{ previewItem?.amount }}</div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="previewDialog = false">Zamknij</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { client, getAuthHeaders, type IInvoice } from "../../api";
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
const search = ref("");
const previewDialog = ref(false);
const previewItem = ref<InvoiceRow | null>(null);
const signingId = ref<string | null>(null);
const sendingId = ref<string | null>(null);
const gettingUpo = ref<string | null>(null);
const { showToast } = useAppToast();

const invoices = ref<IInvoice[]>([]);

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
    if (invoice.sessionReferenceNumber) {
        return { label: "Przesłana do KSeF", color: "success" };
    }
    if (invoice.signed && !invoice.draft) {
        return { label: "Podpisana, nie wysłana", color: "info" };
    }
    if (!invoice.draft) {
        return { label: "Wystawiona", color: "warning" };
    }
    return { label: "Robocza", color: "grey" };
};

const canSend = (row: InvoiceRow) => !row.raw.draft && !row.raw.sessionReferenceNumber;
const canGetUpo = (row: InvoiceRow) => !row.raw.draft && row.raw.referenceNumber;

const tableItems = computed<InvoiceRow[]>(() =>
    invoices.value
        .filter((invoice) => invoice.draft === false)
        .map((invoice) => {
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

const openPreview = (row: InvoiceRow) => {
    previewItem.value = row;
    previewDialog.value = true;
};

const sendInvoice = async (row: InvoiceRow) => {
    if (!canSend(row)) {
        showToast("Faktura nie jest gotowa do wysyłki", "info");
        return;
    }
    sendingId.value = row.id;
    try {
        const res = await client.invoicesSend({
            headers: getAuthHeaders(),
            params: {
                id: row.id,
            },
        });

        if (res.status == 400) {
            showToast(res.body.message, "error");
        }

        if (res.status == 404) {
            showToast(res.body.message);
        }

        if (res.status == 200) {
            showToast("Faktura została przekazana do systemu KSeF.", "success");
            await fetchInvoices();
        }
    } finally {
        sendingId.value = null;
    }
};

const getUPO = async (row: InvoiceRow) => {
    if (!canGetUpo(row)) {
        showToast("Faktura nie została wysłana do KSeF.");
        return;
    }

    gettingUpo.value = row.id;

    try {
        const res = await client.invoicesUpo({
            headers: getAuthHeaders(),
            params: {
                id: row.id,
            },
        });

        if (res.status == 400) {
            showToast(res.body.message, "error");
        }

        if (res.status == 404) {
            showToast(res.body.message);
        }

        if (res.status == 200) {
            const blob = new Blob([res.body.upo], { type: "application/xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            window.open(url, `upo-${row.raw.id}`);
        }
    } finally {
        gettingUpo.value = null;
    }
};

onMounted(() => {
    fetchInvoices();
});
</script>
