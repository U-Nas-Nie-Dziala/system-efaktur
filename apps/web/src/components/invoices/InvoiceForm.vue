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
                            v-model="formState.wybranyKontrahentId"
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
                            v-model="formState.nabywca.nazwa"
                            label="Nazwa kontrahenta"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formState.nabywca.nip"
                            label="NIP"
                            :rules="[rules.required, rules.nip]"
                            variant="outlined"
                            maxlength="10"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formState.nabywca.ulica"
                            label="Ulica"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="formState.nabywca.numer" label="Numer domu/lokalu" variant="outlined" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.nabywca.kodPocztowy"
                            label="Kod pocztowy"
                            :rules="[rules.required, rules.zipcode]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.nabywca.miasto"
                            label="Miasto"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.nabywca.kraj"
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
                            v-model="formState.faktura.numer"
                            label="Numer faktury"
                            :rules="[rules.required]"
                            variant="outlined"
                            maxlength="256"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.faktura.dataWystawienia"
                            label="Data wystawienia"
                            type="date"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.faktura.dataDostawy"
                            label="Data dostawy"
                            type="date"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.faktura.miejsceWystawienia"
                            label="Miejsce wystawienia"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.faktura.waluta"
                            :items="currencyOptions"
                            label="Waluta"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.faktura.rodzaj"
                            :items="invoiceTypeOptions"
                            label="Rodzaj faktury"
                            :rules="[rules.required]"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="formState.faktura.formaPlatnosci"
                            :items="paymentMethodOptions"
                            label="Forma płatności"
                            variant="outlined"
                            clearable
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.faktura.terminPlatnosci"
                            label="Termin płatności"
                            type="date"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formState.faktura.opisPlatnosci"
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

                <v-row v-for="(line, index) in formState.pozycje" :key="line.id" class="mb-4">
                    <v-col cols="12">
                        <v-card variant="outlined">
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-autocomplete
                                            v-model="line.produktId"
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
                                            v-model="line.nazwa"
                                            label="Nazwa"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field v-model="line.jednostka" label="Jednostka" variant="outlined" />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field
                                            v-model.number="line.ilosc"
                                            label="Ilość"
                                            type="number"
                                            :rules="[rules.required, rules.positive]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field
                                            v-model.number="line.cenaNetto"
                                            label="Cena netto"
                                            type="number"
                                            :rules="[rules.required, rules.nonNegative]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-select
                                            v-model="line.stawkaVat"
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
                                                {{ formatAmount(getLineGross(line)) }} {{ formState.faktura.waluta }}
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn
                                    variant="text"
                                    color="error"
                                    :disabled="formState.pozycje.length === 1"
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
                                <div class="text-h6">{{ formatAmount(totals.net) }} {{ formState.faktura.waluta }}</div>
                                <div class="text-caption text-grey mt-2">VAT</div>
                                <div class="text-subtitle-1">
                                    {{ formatAmount(totals.vat) }} {{ formState.faktura.waluta }}
                                </div>
                                <div class="text-caption text-grey mt-2">Razem brutto</div>
                                <div class="text-h6">
                                    {{ formatAmount(totals.gross) }} {{ formState.faktura.waluta }}
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
    produktId: string | null;
    nazwa: string;
    jednostka: string;
    ilosc: number;
    cenaNetto: number;
    stawkaVat: TStawkaPodatku | string;
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
    nabywca: {
        nazwa: "",
        nip: "",
        ulica: "",
        numer: "",
        kodPocztowy: "",
        miasto: "",
        kraj: TKodyKrajowUE.PL,
    },
    faktura: {
        numer: "",
        dataWystawienia: today(),
        dataDostawy: "",
        miejsceWystawienia: "",
        waluta: TKodWaluty.PLN,
        rodzaj: TRodzajFaktury.VAT,
        formaPlatnosci: undefined as TFormaPlatnosci | undefined,
        terminPlatnosci: "",
        opisPlatnosci: "",
    },
    pozycje: [createDefaultLine()],
    wybranyKontrahentId: null as string | null,
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
        produktId: null,
        nazwa: "",
        jednostka: "szt",
        ilosc: 1,
        cenaNetto: 0,
        stawkaVat: TStawkaPodatku.STAWKA_23,
    };
}

const addPosition = () => {
    formState.pozycje.push(createDefaultLine());
};

const removePosition = (index: number) => {
    if (formState.pozycje.length === 1) return;
    formState.pozycje.splice(index, 1);
};

const applyContractor = (value: string | null) => {
    if (!value) return;
    const contractor = (props.contractors ?? []).find((c) => c.id === value);
    if (!contractor) return;
    formState.nabywca.nazwa = contractor.name;
    formState.nabywca.nip = contractor.nip;
    formState.nabywca.ulica = contractor.street;
    formState.nabywca.numer = contractor.address;
    formState.nabywca.kodPocztowy = contractor.zipcode;
    formState.nabywca.miasto = contractor.city;
    formState.nabywca.kraj = (contractor.country as TKodyKrajowUE) || TKodyKrajowUE.PL;
};

const applyProduct = (line: InvoiceLine, value: string | null) => {
    if (!value) return;
    const product = (props.products ?? []).find((p) => p.id === value);
    if (!product) return;
    line.nazwa = product.name;
    line.jednostka = product.unit;
    line.cenaNetto = product.price_netto;
    line.stawkaVat = product.vat_rate as TStawkaPodatku;
};

const parseVatRate = (rate: TStawkaPodatku | string) => {
    const numeric = Number.parseFloat(String(rate).replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const getLineNet = (line: InvoiceLine) => Number(line.ilosc) * Number(line.cenaNetto);

const getLineVat = (line: InvoiceLine) => {
    const net = getLineNet(line);
    const rate = parseVatRate(line.stawkaVat);
    return net * (rate / 100);
};

const getLineGross = (line: InvoiceLine) => getLineNet(line) + getLineVat(line);

const totals = computed(() => {
    return formState.pozycje.reduce(
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

    const adresL1 = `${formState.nabywca.ulica} ${formState.nabywca.numer}`.trim();
    const adresL2 = `${formState.nabywca.kodPocztowy} ${formState.nabywca.miasto}`.trim();

    const sellerAdresL1 = `${props.company.street} ${props.company.address}`.trim();
    const sellerAdresL2 = `${props.company.zipcode} ${props.company.city}`.trim();

    const pozycje = formState.pozycje.map((line, index) => {
        const net = getLineNet(line);
        const vat = getLineVat(line);
        const gross = getLineGross(line);
        return {
            numerWiersza: index + 1,
            nazwa: line.nazwa,
            jednostkaMiary: line.jednostka || undefined,
            ilosc: Number(line.ilosc).toString(),
            cenaJednostkowaNetto: formatAmount(line.cenaNetto),
            wartoscNetto: formatAmount(net),
            stawkaVat: line.stawkaVat as TStawkaPodatku,
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
                nip: formState.nabywca.nip || undefined,
                nazwa: formState.nabywca.nazwa || undefined,
            },
            adres: {
                kodKraju: formState.nabywca.kraj,
                adresL1: adresL1 || formState.nabywca.ulica,
                adresL2: adresL2 || undefined,
            },
            jst: 2,
            gv: 2,
        },
        fa: {
            waluta: formState.faktura.waluta,
            dataWystawienia: formState.faktura.dataWystawienia,
            numerFaktury: formState.faktura.numer,
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
            rodzajFaktury: formState.faktura.rodzaj,
            pozycje,
            dataDostawy: formState.faktura.dataDostawy || undefined,
            miejsceWystawienia: formState.faktura.miejsceWystawienia || undefined,
            platnosc:
                formState.faktura.formaPlatnosci || formState.faktura.terminPlatnosci || formState.faktura.opisPlatnosci
                    ? {
                          formaPlatnosci: formState.faktura.formaPlatnosci,
                          opisPlatnosci: formState.faktura.opisPlatnosci || undefined,
                          terminPlatnosci: formState.faktura.terminPlatnosci
                              ? [{ termin: formState.faktura.terminPlatnosci }]
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
    Object.assign(formState.nabywca, defaults.nabywca);
    Object.assign(formState.faktura, defaults.faktura);
    formState.wybranyKontrahentId = defaults.wybranyKontrahentId;
    formState.pozycje.splice(0, formState.pozycje.length, ...defaults.pozycje);
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
    formState.nabywca.nazwa = ident?.nazwa ?? "";
    formState.nabywca.nip = ident?.nip ?? "";
    const adres = buyer?.adres;
    formState.nabywca.ulica = adres?.adresL1 ?? "";
    formState.nabywca.numer = "";
    formState.nabywca.kodPocztowy = adres?.adresL2?.split(" ")?.[0] ?? "";
    formState.nabywca.miasto = adres?.adresL2?.split(" ")?.slice(1).join(" ") ?? "";
    formState.nabywca.kraj = (adres?.kodKraju as TKodyKrajowUE) ?? TKodyKrajowUE.PL;

    const fa = invoice.body?.fa;
    formState.faktura.numer = fa?.numerFaktury ?? "";
    formState.faktura.dataWystawienia = fa?.dataWystawienia ?? today();
    formState.faktura.dataDostawy = fa?.dataDostawy ?? "";
    formState.faktura.miejsceWystawienia = fa?.miejsceWystawienia ?? "";
    formState.faktura.waluta = (fa?.waluta as TKodWaluty) ?? TKodWaluty.PLN;
    formState.faktura.rodzaj = (fa?.rodzajFaktury as TRodzajFaktury) ?? TRodzajFaktury.VAT;
    formState.faktura.formaPlatnosci = fa?.platnosc?.formaPlatnosci as TFormaPlatnosci | undefined;
    formState.faktura.terminPlatnosci = fa?.platnosc?.terminPlatnosci?.[0]?.termin ?? "";
    formState.faktura.opisPlatnosci = fa?.platnosc?.opisPlatnosci ?? "";

    const positions = (fa?.pozycje ?? []).map((position, index) => ({
        id: `${invoice.id}-${index}`,
        produktId: null,
        nazwa: position.nazwa ?? "",
        jednostka: position.jednostkaMiary ?? "szt",
        ilosc: Number(position.ilosc ?? 1),
        cenaNetto: Number(position.cenaJednostkowaNetto ?? 0),
        stawkaVat: (position.stawkaVat as TStawkaPodatku) ?? TStawkaPodatku.STAWKA_23,
    }));

    formState.pozycje.splice(0, formState.pozycje.length, ...(positions.length ? positions : [createDefaultLine()]));

    const contractorMatch = (props.contractors ?? []).find(
        (contractor) => contractor.nip === formState.nabywca.nip || contractor.name === formState.nabywca.nazwa
    );
    formState.wybranyKontrahentId = contractorMatch?.id ?? null;
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
