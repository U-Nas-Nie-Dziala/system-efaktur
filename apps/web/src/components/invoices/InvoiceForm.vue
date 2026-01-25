<template>
    <v-card class="h-100 d-flex flex-column">
        <v-toolbar flat>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-btn icon="mdi:mdi-close" variant="text" @click="$emit('close')" />
        </v-toolbar>
        <v-divider />
        <v-card-text class="flex-grow-1 overflow-y-auto">
            <v-alert v-if="!companyReady" type="warning" variant="tonal" class="mb-4">
                Brak danych firmy. Uzupełnij je w ustawieniach, aby wystawiać faktury.
            </v-alert>
            <v-form ref="form" v-model="formValid">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-autocomplete
                            v-model="formState.selectedContractorId"
                            :items="contractorOptions"
                            label="Wybierz kontrahenta (kopiuje dane)"
                            item-title="title"
                            item-value="value"
                            clearable
                            variant="outlined"
                            @update:model-value="applyContractor"
                        />
                    </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                    <v-col cols="12">
                        <h3 class="text-h6">Nabywca</h3>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formState.buyer.name"
                            label="Nazwa kontrahenta"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formState.buyer.nip"
                            label="NIP"
                            :rules="[rules.required, rules.nip]"
                            variant="outlined"
                            maxlength="10"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formState.buyer.street"
                            label="Ulica"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formState.buyer.address" label="Numer domu/lokalu" variant="outlined" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.buyer.zipcode"
                            label="Kod pocztowy"
                            :rules="[rules.required, rules.zipcode]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.buyer.city"
                            label="Miasto"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.buyer.country"
                            :items="countryOptions"
                            label="Kraj"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                    <v-col cols="12">
                        <h3 class="text-h6">Dane faktury</h3>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.number"
                            label="Numer faktury"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="256"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.issueDate"
                            label="Data wystawienia"
                            type="date"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.saleDate"
                            label="Data dostawy"
                            type="date"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.place"
                            label="Miejsce wystawienia"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.invoice.currency"
                            :items="currencyOptions"
                            label="Waluta"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.invoice.type"
                            :items="invoiceTypeOptions"
                            label="Rodzaj faktury"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.invoice.paymentMethod"
                            :items="paymentMethodOptions"
                            label="Forma płatności"
                            variant="outlined"
                            clearable
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.paymentDueDate"
                            label="Termin płatności"
                            type="date"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.invoice.paymentDescription"
                            label="Opis płatności"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                    <v-col cols="12" class="d-flex align-center justify-space-between">
                        <h3 class="text-h6">Pozycje faktury</h3>
                        <v-btn variant="outlined" prepend-icon="mdi:mdi-plus" @click="addPosition">Dodaj pozycję</v-btn>
                    </v-col>
                </v-row>

                <v-row v-for="(line, index) in formState.positions" :key="line.id" class="mb-4">
                    <v-col cols="12">
                        <v-card variant="outlined">
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-autocomplete
                                            v-model="line.productId"
                                            :items="productOptions"
                                            label="Wybierz towar/usługę (kopiuje dane)"
                                            item-title="title"
                                            item-value="value"
                                            clearable
                                            variant="outlined"
                                            @update:model-value="(value) => applyProduct(line, value)"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field
                                            v-model="line.name"
                                            label="Nazwa"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="line.unit" label="Jednostka" variant="outlined" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field
                                            v-model.number="line.quantity"
                                            label="Ilość"
                                            type="number"
                                            :rules="[rules.required, rules.positive]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field
                                            v-model.number="line.priceNetto"
                                            label="Cena netto"
                                            type="number"
                                            :rules="[rules.required, rules.nonNegative]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-select
                                            v-model="line.vatRate"
                                            :items="vatRateOptions"
                                            label="Stawka VAT"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="3" class="d-flex align-center">
                                        <div>
                                            <div class="text-caption text-grey">Wartość brutto</div>
                                            <div class="text-subtitle-1 font-weight-medium">
                                                {{ formatAmount(getLineGross(line)) }} {{ formState.invoice.currency }}
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn
                                    variant="text"
                                    color="error"
                                    :disabled="formState.positions.length === 1"
                                    @click="removePosition(index)"
                                >
                                    Usuń pozycję
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" md="4">
                        <v-card variant="tonal">
                            <v-card-text>
                                <div class="text-caption text-grey">Razem netto</div>
                                <div class="text-h6">
                                    {{ formatAmount(totals.net) }} {{ formState.invoice.currency }}
                                </div>
                                <div class="text-caption text-grey mt-2">VAT</div>
                                <div class="text-subtitle-1">
                                    {{ formatAmount(totals.vat) }} {{ formState.invoice.currency }}
                                </div>
                                <div class="text-caption text-grey mt-2">Razem brutto</div>
                                <div class="text-h6">
                                    {{ formatAmount(totals.gross) }} {{ formState.invoice.currency }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="reset">Wyczyść</v-btn>
            <v-btn color="#d63031" :loading="loading" :disabled="!formValid || !companyReady" @click="submit">
                {{ submitLabel }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { VForm } from "vuetify/components";
import {
    contract,
    type IContractor,
    type IInvoice,
    type IInvoiceCreateBody,
    type IMeInfo,
    type IProduct,
} from "../../api";
import { TFormaPlatnosci, TKodWaluty, TKodyKrajowUE, TRodzajFaktury, TStawkaPodatku } from "@repo/contract/ksef/enums";

type InvoiceLine = {
    id: string;
    productId: string | null;
    name: string;
    unit: string;
    quantity: number;
    priceNetto: number;
    vatRate: TStawkaPodatku | string;
};

const props = defineProps<{
    invoice?: IInvoice | null;
    contractors?: IContractor[];
    products?: IProduct[];
    company?: IMeInfo["company"] | null;
    loading?: boolean;
    title?: string;
    submitLabel?: string;
}>();

const emit = defineEmits<{
    (e: "submit", payload: IInvoiceCreateBody): void;
    (e: "close"): void;
}>();

const formValid = ref(false);
const form = ref<VForm | null>(null);

const companyReady = computed(() => Boolean(props.company?.nip && props.company?.name && props.company?.street));

const today = () => new Date().toISOString().slice(0, 10);

const defaultForm = () => ({
    buyer: {
        name: "",
        nip: "",
        street: "",
        address: "",
        zipcode: "",
        city: "",
        country: TKodyKrajowUE.PL,
    },
    invoice: {
        number: "",
        issueDate: today(),
        saleDate: "",
        place: "",
        currency: TKodWaluty.PLN,
        type: TRodzajFaktury.VAT,
        paymentMethod: undefined as TFormaPlatnosci | undefined,
        paymentDueDate: "",
        paymentDescription: "",
    },
    positions: [createDefaultLine()],
    selectedContractorId: null as string | null,
});

const formState = reactive(defaultForm());

const currencyOptions = Object.values(TKodWaluty).map((value) => ({ title: value, value }));
const countryOptions = Object.values(TKodyKrajowUE).map((value) => ({ title: value, value }));
const vatRateOptions = Object.values(TStawkaPodatku).map((value) => ({ title: value, value }));

const invoiceTypeOptions = [
    { title: "VAT", value: TRodzajFaktury.VAT },
    { title: "Korygująca", value: TRodzajFaktury.KOR },
    { title: "Zaliczkowa", value: TRodzajFaktury.ZAL },
    { title: "Rozliczeniowa", value: TRodzajFaktury.ROZ },
    { title: "Uproszczona", value: TRodzajFaktury.UPR },
    { title: "Korygująca zaliczkowa", value: TRodzajFaktury.KOR_ZAL },
    { title: "Korygująca rozliczeniowa", value: TRodzajFaktury.KOR_ROZ },
];

const paymentMethodOptions = [
    { title: "Gotówka", value: TFormaPlatnosci.GOTOWKA },
    { title: "Karta", value: TFormaPlatnosci.KARTA },
    { title: "Bon", value: TFormaPlatnosci.BON },
    { title: "Czek", value: TFormaPlatnosci.CZEK },
    { title: "Kredyt", value: TFormaPlatnosci.KREDYT },
    { title: "Przelew", value: TFormaPlatnosci.PRZELEW },
    { title: "Mobilna", value: TFormaPlatnosci.MOBILNA },
];

const contractorOptions = computed(() =>
    (props.contractors ?? []).map((contractor) => ({
        title: `${contractor.own_name} (${contractor.nip})`,
        value: contractor.id,
        contractor,
    }))
);

const productOptions = computed(() =>
    (props.products ?? []).map((product) => ({
        title: `${product.name} (${product.type === "PRODUCT" ? "Towar" : "Usługa"})`,
        value: product.id,
        product,
    }))
);

const rules = {
    required: (v: string | number) => (v !== null && v !== undefined && v !== "") || "Pole wymagane",
    nip: (v: string) => /^\d{10}$/.test(v) || "NIP musi zawierać 10 cyfr",
    zipcode: (v: string) => /^\d{2}-?\d{3}$/.test(v) || "Nieprawidłowy format kodu pocztowego",
    positive: (v: number) => v > 0 || "Wartość musi być dodatnia",
    nonNegative: (v: number) => v >= 0 || "Wartość nie może być ujemna",
};

function createDefaultLine(): InvoiceLine {
    return {
        id: crypto.randomUUID(),
        productId: null,
        name: "",
        unit: "szt",
        quantity: 1,
        priceNetto: 0,
        vatRate: TStawkaPodatku.STAWKA_23,
    };
}

const addPosition = () => {
    formState.positions.push(createDefaultLine());
};

const removePosition = (index: number) => {
    if (formState.positions.length === 1) return;
    formState.positions.splice(index, 1);
};

const applyContractor = (value: string | null) => {
    if (!value) return;
    const contractor = (props.contractors ?? []).find((c) => c.id === value);
    if (!contractor) return;
    formState.buyer.name = contractor.name;
    formState.buyer.nip = contractor.nip;
    formState.buyer.street = contractor.street;
    formState.buyer.address = contractor.address;
    formState.buyer.zipcode = contractor.zipcode;
    formState.buyer.city = contractor.city;
    formState.buyer.country = (contractor.country as TKodyKrajowUE) || TKodyKrajowUE.PL;
};

const applyProduct = (line: InvoiceLine, value: string | null) => {
    if (!value) return;
    const product = (props.products ?? []).find((p) => p.id === value);
    if (!product) return;
    line.name = product.name;
    line.unit = product.unit;
    line.priceNetto = product.price_netto;
    line.vatRate = product.vat_rate as TStawkaPodatku;
};

const parseVatRate = (rate: TStawkaPodatku | string) => {
    const numeric = Number.parseFloat(String(rate).replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const getLineNet = (line: InvoiceLine) => Number(line.quantity) * Number(line.priceNetto);

const getLineVat = (line: InvoiceLine) => {
    const net = getLineNet(line);
    const rate = parseVatRate(line.vatRate);
    return net * (rate / 100);
};

const getLineGross = (line: InvoiceLine) => getLineNet(line) + getLineVat(line);

const totals = computed(() => {
    return formState.positions.reduce(
        (acc, line) => {
            acc.net += getLineNet(line);
            acc.vat += getLineVat(line);
            acc.gross += getLineGross(line);
            return acc;
        },
        { net: 0, vat: 0, gross: 0 }
    );
});

const formatAmount = (value: number) => Number(value || 0).toFixed(2);

const buildPayload = (): IInvoiceCreateBody | null => {
    if (!props.company) {
        return null;
    }

    const adresL1 = `${formState.buyer.street} ${formState.buyer.address}`.trim();
    const adresL2 = `${formState.buyer.zipcode} ${formState.buyer.city}`.trim();

    const sellerAdresL1 = `${props.company.street} ${props.company.address}`.trim();
    const sellerAdresL2 = `${props.company.zipcode} ${props.company.city}`.trim();

    const pozycje = formState.positions.map((line, index) => {
        const net = getLineNet(line);
        const vat = getLineVat(line);
        const gross = getLineGross(line);
        return {
            numerWiersza: index + 1,
            nazwa: line.name,
            jednostkaMiary: line.unit || undefined,
            ilosc: Number(line.quantity).toString(),
            cenaJednostkowaNetto: formatAmount(line.priceNetto),
            wartoscNetto: formatAmount(net),
            stawkaVat: line.vatRate as TStawkaPodatku,
            kwotaVat: formatAmount(vat),
            wartoscBrutto: formatAmount(gross),
        };
    });

    return {
        podmiot1: {
            daneIdentyfikacyjne: {
                nip: props.company.nip || "",
                nazwa: props.company.name,
            },
            adres: {
                kodKraju: props.company.country || TKodyKrajowUE.PL,
                adresL1: sellerAdresL1 || props.company.street,
                adresL2: sellerAdresL2 || undefined,
            },
        },
        podmiot2: {
            daneIdentyfikacyjne: {
                nip: formState.buyer.nip || undefined,
                nazwa: formState.buyer.name || undefined,
            },
            adres: {
                kodKraju: formState.buyer.country,
                adresL1: adresL1 || formState.buyer.street,
                adresL2: adresL2 || undefined,
            },
            jst: 2,
            gv: 2,
        },
        fa: {
            waluta: formState.invoice.currency,
            dataWystawienia: formState.invoice.issueDate,
            numerFaktury: formState.invoice.number,
            kwotaBrutto: formatAmount(totals.value.gross),
            adnotacje: {
                metodaKasowa: 2,
                samofakturowanie: 2,
                odwrotneObciazenie: 2,
                splitPayment: 2,
                zwolnienie: {
                    zwolnienieNie: 1,
                },
                noweSrodkiTransportu: {
                    wdtNstNie: 1,
                },
                proceduraUproszczonaWNT: 2,
                proceduraMarzy: {
                    marzyNie: 1,
                },
            },
            rodzajFaktury: formState.invoice.type,
            pozycje,
            dataDostawy: formState.invoice.saleDate || undefined,
            miejsceWystawienia: formState.invoice.place || undefined,
            platnosc:
                formState.invoice.paymentMethod ||
                formState.invoice.paymentDueDate ||
                formState.invoice.paymentDescription
                    ? {
                          formaPlatnosci: formState.invoice.paymentMethod,
                          opisPlatnosci: formState.invoice.paymentDescription || undefined,
                          terminPlatnosci: formState.invoice.paymentDueDate
                              ? [{ termin: formState.invoice.paymentDueDate }]
                              : undefined,
                      }
                    : undefined,
        },
    };
};

const submit = async () => {
    const result = await form.value?.validate();
    if (!result?.valid) return;
    const payload = buildPayload();
    if (!payload) return;
    const validation = await contract.invoicesCreate.body.safeParseAsync(payload);
    if (!validation.success) return;
    emit("submit", payload);
};

const reset = () => {
    const defaults = defaultForm();
    Object.assign(formState.buyer, defaults.buyer);
    Object.assign(formState.invoice, defaults.invoice);
    formState.selectedContractorId = defaults.selectedContractorId;
    formState.positions.splice(0, formState.positions.length, ...defaults.positions);
    form.value?.resetValidation();
    formValid.value = false;
};

const loadFromInvoice = (invoice?: IInvoice | null) => {
    if (!invoice) {
        reset();
        return;
    }

    const buyer = invoice.nabywca?.podmiot2;
    const ident = buyer?.daneIdentyfikacyjne;
    formState.buyer.name = ident?.nazwa ?? "";
    formState.buyer.nip = ident?.nip ?? "";
    const adres = buyer?.adres;
    formState.buyer.street = adres?.adresL1 ?? "";
    formState.buyer.address = "";
    formState.buyer.zipcode = adres?.adresL2?.split(" ")?.[0] ?? "";
    formState.buyer.city = adres?.adresL2?.split(" ")?.slice(1).join(" ") ?? "";
    formState.buyer.country = (adres?.kodKraju as TKodyKrajowUE) ?? TKodyKrajowUE.PL;

    const fa = invoice.body?.fa;
    formState.invoice.number = fa?.numerFaktury ?? "";
    formState.invoice.issueDate = fa?.dataWystawienia ?? today();
    formState.invoice.saleDate = fa?.dataDostawy ?? "";
    formState.invoice.place = fa?.miejsceWystawienia ?? "";
    formState.invoice.currency = (fa?.waluta as TKodWaluty) ?? TKodWaluty.PLN;
    formState.invoice.type = (fa?.rodzajFaktury as TRodzajFaktury) ?? TRodzajFaktury.VAT;
    formState.invoice.paymentMethod = fa?.platnosc?.formaPlatnosci as TFormaPlatnosci | undefined;
    formState.invoice.paymentDueDate = fa?.platnosc?.terminPlatnosci?.[0]?.termin ?? "";
    formState.invoice.paymentDescription = fa?.platnosc?.opisPlatnosci ?? "";

    const positions = (fa?.pozycje ?? []).map((position, index) => ({
        id: `${invoice.id}-${index}`,
        productId: null,
        name: position.nazwa ?? "",
        unit: position.jednostkaMiary ?? "szt",
        quantity: Number(position.ilosc ?? 1),
        priceNetto: Number(position.cenaJednostkowaNetto ?? 0),
        vatRate: (position.stawkaVat as TStawkaPodatku) ?? TStawkaPodatku.STAWKA_23,
    }));

    formState.positions.splice(
        0,
        formState.positions.length,
        ...(positions.length ? positions : [createDefaultLine()])
    );

    const contractorMatch = (props.contractors ?? []).find(
        (contractor) => contractor.nip === formState.buyer.nip || contractor.name === formState.buyer.name
    );
    formState.selectedContractorId = contractorMatch?.id ?? null;
};

watch(
    () => props.invoice,
    (invoice) => {
        loadFromInvoice(invoice ?? null);
    },
    { immediate: true }
);

defineExpose({ reset });
</script>
