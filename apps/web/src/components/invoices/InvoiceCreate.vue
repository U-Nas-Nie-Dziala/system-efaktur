<template>
  <v-card>
    <v-card-title class="text-h6">
      {{ invoice ? "Edytuj fakturę" : "Dodaj fakturę" }}
    </v-card-title>
    
    <v-card-text>
      <v-form ref="form" v-model="formValid">
        <!-- Nagłówek faktury -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.numerFaktury"
              label="Numer faktury"
              :rules="[rules.required]"
              variant="outlined"
              maxlength="256"
              counter
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.dataWystawienia"
              label="Data wystawienia"
              :rules="[rules.required, rules.date]"
              variant="outlined"
              type="date"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="invoiceForm.waluta"
              :items="currencies"
              label="Waluta"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :model-value="totalBrutto"
              label="Kwota brutto (suma)"
              variant="outlined"
              disabled
              :suffix="invoiceForm.waluta as string"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Sprzedawca -->
        <h3 class="text-subtitle-1 mb-3">Sprzedawca</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.sprzedawca.nazwa"
              label="Nazwa"
              :rules="[rules.required]"
              variant="outlined"
              maxlength="512"
              counter
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.sprzedawca.nip"
              label="NIP"
              :rules="[rules.required, rules.nip]"
              variant="outlined"
              maxlength="10"
              counter
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.sprzedawca.adresL1"
              label="Adres (linia 1)"
              :rules="[rules.required]"
              variant="outlined"
              maxlength="256"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.sprzedawca.adresL2"
              label="Adres (linia 2)"
              variant="outlined"
              maxlength="256"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Nabywca -->
        <h3 class="text-subtitle-1 mb-3">Nabywca</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.nabywca.nazwa"
              label="Nazwa"
              :rules="[rules.required]"
              variant="outlined"
              maxlength="512"
              counter
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="invoiceForm.nabywca.nip"
              label="NIP (opcjonalnie)"
              :rules="[rules.nipOptional]"
              variant="outlined"
              maxlength="10"
              counter
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Pozycje faktury -->
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="text-subtitle-1">Pozycje faktury</h3>
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            prepend-icon="mdi-plus"
            @click="addPosition"
          >
            Dodaj pozycję
          </v-btn>
        </div>

        <v-card
          v-for="(pos, index) in invoiceForm.pozycje"
          :key="index"
          variant="outlined"
          class="mb-3 pa-3"
        >
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="pos.nazwa"
                label="Nazwa"
                :rules="[rules.required]"
                variant="outlined"
                density="compact"
                maxlength="256"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="pos.ilosc"
                label="Ilość"
                :rules="[rules.required, rules.positive]"
                variant="outlined"
                density="compact"
                type="number"
                step="0.01"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="pos.cenaNetto"
                label="Cena netto"
                :rules="[rules.required, rules.price]"
                variant="outlined"
                density="compact"
                type="number"
                step="0.01"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-select
                v-model="pos.stawkaVat"
                :items="vatRates"
                label="VAT"
                :rules="[rules.required]"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="6" md="1">
              <v-text-field
                :model-value="calculateBrutto(pos)"
                label="Brutto"
                variant="outlined"
                density="compact"
                disabled
              />
            </v-col>
            <v-col cols="12" md="1" class="d-flex align-center justify-center">
              <v-btn
                icon
                color="error"
                variant="text"
                size="small"
                :disabled="invoiceForm.pozycje.length <= 1"
                @click="removePosition(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="reset">Wyczyść</v-btn>
      <v-btn variant="text" @click="emit('close')">Anuluj</v-btn>
      <v-btn
        color="#d63031"
        :loading="loading"
        :disabled="!formValid"
        @click="submit"
      >
        {{ invoice ? "Zapisz" : "Dodaj" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import type { VForm } from "vuetify/components";



const VatRate = {
  VAT_23: "23%",
  VAT_8: "8%",
  VAT_5: "5%",
  VAT_0: "0%",
} as const;

type VatRate = typeof VatRate[keyof typeof VatRate]; 

const Currency = {
  PLN: "PLN",
  EUR: "EUR",
  USD: "USD",
  GBP: "GBP",
} as const;

type Currency = typeof Currency[keyof typeof Currency]; 


interface FormPosition {
  nazwa: string;
  ilosc: number;
  cenaNetto: number;
  stawkaVat: VatRate;
}

interface InvoiceFormData {
  numerFaktury: string;
  dataWystawienia: string;
  waluta: Currency;
  sprzedawca: {
    nazwa: string;
    nip: string;
    adresL1: string;
    adresL2: string;
  };
  nabywca: {
    nazwa: string;
    nip: string;
  };
  pozycje: FormPosition[];
}


interface InvoiceDraft {
  id?: string;
  draft?: boolean;
  signed?: boolean;
  sessionReferenceNumber?: string;
  podmiot1: {
    daneIdentyfikacyjne: { nip: string; nazwa: string };
    adres: { adresL1: string; adresL2?: string };
  };
  podmiot2: {
    daneIdentyfikacyjne: { nazwa: string; nip?: string };
  };
  body: {
    fa: {
      numerFaktury: string;
      dataWystawienia: string;
      waluta: Currency;
      pozycje: {
        nazwa: string;
        ilosc: number;
        cenaNetto: number;
        stawkaVat: VatRate;
        wartoscNetto: number;
        kwotaVat: number;
        wartoscBrutto: number;
      }[];
      kwotaBrutto: number;
    };
  };
}




const props = defineProps<{
  invoice?: InvoiceDraft | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "save", payload: InvoiceDraft): void;
  (e: "close"): void;
}>();

// ============================================
// STAŁE
// ============================================

const vatRates: readonly VatRate[] = Object.values(VatRate);
const currencies: readonly Currency[] = Object.values(Currency);

const defaultPosition = (): FormPosition => ({
  nazwa: "",
  ilosc: 1,
  cenaNetto: 0,
  stawkaVat: VatRate.VAT_23,
});

const defaultForm = (): InvoiceFormData => ({
  numerFaktury: "",
  dataWystawienia: new Date().toISOString().split("T")[0],
  waluta: Currency.PLN,
  sprzedawca: {
    nazwa: "",
    nip: "",
    adresL1: "",
    adresL2: "",
  },
  nabywca: {
    nazwa: "",
    nip: "",
  },
  pozycje: [defaultPosition()],
});



const formValid = ref(false);
const form = ref<VForm | null>(null);
const invoiceForm = reactive<InvoiceFormData>(defaultForm());



const nipRegex = /^[1-9]\d{9}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const rules = {
  required: (v: any) => !!v || "Pole wymagane",
  positive: (v: number) => v > 0 || "Wartość musi być dodatnia",
  price: (v: number) => v >= 0 || "Cena nie może być ujemna",
  nip: (v: string) => nipRegex.test(v) || "Nieprawidłowy NIP",
  nipOptional: (v: string) => !v || nipRegex.test(v) || "Nieprawidłowy NIP",
  date: (v: string) => dateRegex.test(v) || "Nieprawidłowa data",
};




const getVatMultiplier = (rate: VatRate): number => {
  const match = rate.match(/\d+/);
  return match ? Number(match[0]) / 100 : 0;
};

const calculateBrutto = (pos: FormPosition): string => {
  const netto = pos.ilosc * pos.cenaNetto;
  return (netto * (1 + getVatMultiplier(pos.stawkaVat))).toFixed(2);
};

const totalBrutto = computed(() => {
  return invoiceForm.pozycje
    .reduce((s, p) => s + Number(calculateBrutto(p)), 0)
    .toFixed(2);
});



const addPosition = () => invoiceForm.pozycje.push(defaultPosition());

const removePosition = (index: number) => {
  if (invoiceForm.pozycje.length > 1) invoiceForm.pozycje.splice(index, 1);
};


const reset = () => {
  Object.assign(invoiceForm, defaultForm());
  form.value?.resetValidation();
  formValid.value = false;
};



const initializeFromInvoice = (invoice: InvoiceDraft) => {
  invoiceForm.numerFaktury = invoice.body.fa.numerFaktury;
  invoiceForm.dataWystawienia = invoice.body.fa.dataWystawienia;
  invoiceForm.waluta = invoice.body.fa.waluta;

  invoiceForm.sprzedawca = {
    nazwa: invoice.podmiot1.daneIdentyfikacyjne.nazwa,
    nip: invoice.podmiot1.daneIdentyfikacyjne.nip,
    adresL1: invoice.podmiot1.adres.adresL1,
    adresL2: invoice.podmiot1.adres.adresL2 || "",
  };

  invoiceForm.nabywca = {
    nazwa: invoice.podmiot2.daneIdentyfikacyjne.nazwa,
    nip: invoice.podmiot2.daneIdentyfikacyjne.nip || "",
  };

  invoiceForm.pozycje = invoice.body.fa.pozycje.map((p) => ({
    nazwa: p.nazwa,
    ilosc: p.ilosc,
    cenaNetto: p.cenaNetto,
    stawkaVat: p.stawkaVat,
  }));
};




const buildDraft = (): InvoiceDraft => {
  const pozycje = invoiceForm.pozycje.map((pos) => {
    const netto = pos.ilosc * pos.cenaNetto;
    const vat = netto * getVatMultiplier(pos.stawkaVat);
    return {
      numerWiersza: 0, // jeśli potrzebujesz numerację, możesz dodać index + 1
      nazwa: pos.nazwa,
      ilosc: pos.ilosc,
      cenaNetto: pos.cenaNetto,
      stawkaVat: pos.stawkaVat,
      wartoscNetto: netto,
      kwotaVat: vat,
      wartoscBrutto: netto + vat,
    };
  });

  return {
    podmiot1: {
      daneIdentyfikacyjne: {
        nazwa: invoiceForm.sprzedawca.nazwa,
        nip: invoiceForm.sprzedawca.nip,
      },
      adres: {
        adresL1: invoiceForm.sprzedawca.adresL1,
        adresL2: invoiceForm.sprzedawca.adresL2 || "",
      },
    },
    podmiot2: {
      daneIdentyfikacyjne: {
        nazwa: invoiceForm.nabywca.nazwa,
        nip: invoiceForm.nabywca.nip || "",
      },
    },
    body: {
      fa: {
        numerFaktury: invoiceForm.numerFaktury,
        dataWystawienia: invoiceForm.dataWystawienia,
        waluta: invoiceForm.waluta,
        pozycje,
        kwotaBrutto: pozycje.reduce((s, p) => s + p.wartoscBrutto, 0),
      },
    },
  };
};





const submit = async () => {
  const result = await form.value?.validate();
  if (!result?.valid) return;

  const draft = buildDraft();


  localStorage.setItem("invoiceDraft", JSON.stringify(draft));

  emit("save", draft);
};

defineExpose({ reset });
</script>
