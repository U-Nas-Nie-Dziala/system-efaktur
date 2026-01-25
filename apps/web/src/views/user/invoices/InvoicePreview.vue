<template>
    <v-container fluid>
        <v-row class="mb-2">
            <v-col class="d-flex align-center">
                <v-btn variant="text" prepend-icon="mdi:mdi-arrow-left" @click="goBack">Wróć</v-btn>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col>
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <h1 class="text-h4">Podgląd faktury</h1>
                        <p class="text-subtitle-1 text-grey">
                            {{ invoice?.body?.fa?.numerFaktury || "" }}
                        </p>
                    </div>
                    <div class="d-flex align-center ga-2">
                        <v-chip v-if="invoice" size="small" :color="status.color" variant="tonal">
                            {{ status.label }}
                        </v-chip>
                        <v-btn variant="outlined" prepend-icon="mdi:mdi-pencil" :disabled="!invoice" @click="goToEdit">
                            Edytuj
                        </v-btn>
                        <v-btn
                            color="#d63031"
                            prepend-icon="mdi:mdi-content-save"
                            :loading="saving"
                            :disabled="!canSave"
                            @click="saveInvoice"
                        >
                            Zapisz
                        </v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-alert v-if="!loading && !invoice" type="info" variant="tonal" class="mb-4">
            Nie znaleziono faktury.
        </v-alert>

        <v-card v-if="invoice" class="mb-4">
            <v-card-title>Informacje podstawowe</v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Numer faktury</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.numerFaktury }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Data wystawienia</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.dataWystawienia }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Waluta</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.waluta }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Rodzaj faktury</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.rodzajFaktury }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Miejsce wystawienia</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.miejsceWystawienia || "-" }}</div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="text-caption text-grey">Data dostawy</div>
                        <div class="text-subtitle-1">{{ invoice.body?.fa?.dataDostawy || "-" }}</div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-row v-if="invoice" class="mb-4">
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Sprzedawca</v-card-title>
                    <v-divider />
                    <v-card-text>
                        <div class="text-subtitle-1">
                            {{ invoice.sprzedawca?.podmiot1?.daneIdentyfikacyjne?.nazwa }}
                        </div>
                        <div class="text-caption text-grey">
                            NIP: {{ invoice.sprzedawca?.podmiot1?.daneIdentyfikacyjne?.nip }}
                        </div>
                        <div class="text-body-2 mt-2">
                            {{ invoice.sprzedawca?.podmiot1?.adres?.adresL1 }}
                        </div>
                        <div class="text-body-2">
                            {{ invoice.sprzedawca?.podmiot1?.adres?.adresL2 }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>Nabywca</v-card-title>
                    <v-divider />
                    <v-card-text>
                        <div class="text-subtitle-1">{{ invoice.nabywca?.podmiot2?.daneIdentyfikacyjne?.nazwa }}</div>
                        <div class="text-caption text-grey">
                            NIP: {{ invoice.nabywca?.podmiot2?.daneIdentyfikacyjne?.nip }}
                        </div>
                        <div class="text-body-2 mt-2">
                            {{ invoice.nabywca?.podmiot2?.adres?.adresL1 }}
                        </div>
                        <div class="text-body-2">
                            {{ invoice.nabywca?.podmiot2?.adres?.adresL2 }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-card v-if="invoice" class="mb-4">
            <v-card-title>Pozycje faktury</v-card-title>
            <v-divider />
            <v-data-table
                :headers="positionHeaders"
                :items="positions"
                class="elevation-1"
                density="compact"
                hide-default-footer
            />
        </v-card>

        <v-row v-if="invoice">
            <v-col cols="12" md="4">
                <v-card variant="tonal">
                    <v-card-text>
                        <div class="text-caption text-grey">Razem netto</div>
                        <div class="text-h6">{{ formatAmount(totals.net) }} {{ invoice.body?.fa?.waluta }}</div>
                        <div class="text-caption text-grey mt-2">VAT</div>
                        <div class="text-subtitle-1">{{ formatAmount(totals.vat) }} {{ invoice.body?.fa?.waluta }}</div>
                        <div class="text-caption text-grey mt-2">Razem brutto</div>
                        <div class="text-h6">{{ formatAmount(totals.gross) }} {{ invoice.body?.fa?.waluta }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { client, getAuthHeaders, type IInvoice } from "../../../api";
import { useAppToast } from "../../../composables/useAppToast";

type PositionRow = {
    numer: number;
    nazwa: string;
    ilosc: string;
    jednostka: string;
    stawkaVat: string;
    netto: string;
    vat: string;
    brutto: string;
};

const route = useRoute();
const router = useRouter();
const { showToast } = useAppToast();

const invoice = ref<IInvoice | null>(null);
const loading = ref(false);
const saving = ref(false);

const positionHeaders = [
    { title: "Lp.", key: "numer", sortable: false },
    { title: "Nazwa", key: "nazwa", sortable: false },
    { title: "Ilość", key: "ilosc", sortable: false },
    { title: "Jednostka", key: "jednostka", sortable: false },
    { title: "VAT", key: "stawkaVat", sortable: false },
    { title: "Netto", key: "netto", sortable: false },
    { title: "VAT", key: "vat", sortable: false },
    { title: "Brutto", key: "brutto", sortable: false },
];

const status = computed(() => {
    if (!invoice.value) {
        return { label: "", color: "info" };
    }
    if (invoice.value.signed) {
        return { label: "Podpisana", color: "success" };
    }
    if (invoice.value.draft) {
        return { label: "Robocza", color: "warning" };
    }
    return { label: "Zapisana", color: "info" };
});

const canSave = computed(() => Boolean(invoice.value?.draft && !invoice.value?.signed));

const parseAmount = (value?: string | number) => {
    const numberValue = Number(value ?? 0);
    return Number.isFinite(numberValue) ? numberValue : 0;
};

const positions = computed<PositionRow[]>(() => {
    const items = invoice.value?.body?.fa?.pozycje ?? [];
    return items.map((item) => ({
        numer: item.numerWiersza,
        nazwa: item.nazwa,
        ilosc: item.ilosc ?? "-",
        jednostka: item.jednostkaMiary ?? "-",
        stawkaVat: item.stawkaVat ?? "-",
        netto: item.wartoscNetto ?? "-",
        vat: item.kwotaVat ?? "-",
        brutto: item.wartoscBrutto ?? "-",
    }));
});

const totals = computed(() => {
    const items = invoice.value?.body?.fa?.pozycje ?? [];
    return items.reduce(
        (acc, item) => {
            acc.net += parseAmount(item.wartoscNetto);
            acc.vat += parseAmount(item.kwotaVat);
            acc.gross += parseAmount(item.wartoscBrutto);
            return acc;
        },
        { net: 0, vat: 0, gross: 0 }
    );
});

const formatAmount = (value: number) => Number(value || 0).toFixed(2);

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

const saveInvoice = async () => {
    if (!invoice.value) return;
    if (!canSave.value) {
        showToast("Ta faktura została już zapisana", "info");
        return;
    }
    saving.value = true;
    try {
        const response = await client.invoicesSave({
            params: { id: invoice.value.id },
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showToast("Faktura została zapisana", "success");
            await fetchInvoice();
        } else {
            const body = response.body as { message?: string };
            showToast(body.message || "Nie udało się zapisać faktury", "error");
        }
    } catch (error) {
        showToast("Wystąpił błąd podczas zapisywania faktury", "error");
    } finally {
        saving.value = false;
    }
};

const goToEdit = () => {
    if (!invoice.value) return;
    router.push({ name: "invoice-edit", params: { id: invoice.value.id } });
};

const goBack = () => {
    router.push({ name: "invoices" });
};

watch(
    () => route.params.id,
    () => {
        fetchInvoice();
    }
);

onMounted(() => {
    fetchInvoice();
});
</script>
