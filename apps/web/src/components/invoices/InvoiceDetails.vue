<template>
  <v-card>
    <v-card-title class="text-h6 d-flex align-center">
      <v-icon start>mdi-file-document-outline</v-icon>
      Szczegóły faktury
    </v-card-title>

    <v-card-text v-if="!invoice">
      <v-alert type="info" variant="tonal">Nie wybrano faktury.</v-alert>
    </v-card-text>

    <v-card-text v-else>
      <!-- Nagłówek -->
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Numer faktury</div>
          <div class="text-body-1 font-weight-medium">{{ invoice.body.fa.numerFaktury }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Data wystawienia</div>
          <div class="text-body-1">{{ formatDate(invoice.body.fa.dataWystawienia) }}</div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Sprzedawca -->
      <h3 class="text-subtitle-2 text-grey mb-2">Sprzedawca</h3>
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Nazwa</div>
          <div class="text-body-1">{{ invoice.podmiot1.daneIdentyfikacyjne.nazwa }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">NIP</div>
          <div class="text-body-1">{{ invoice.podmiot1.daneIdentyfikacyjne.nip }}</div>
        </v-col>
        <v-col cols="12">
          <div class="text-caption text-grey">Adres</div>
          <div class="text-body-1">
            {{ invoice.podmiot1.adres.adresL1 }}
            <span v-if="invoice.podmiot1.adres.adresL2">, {{ invoice.podmiot1.adres.adresL2 }}</span>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Nabywca -->
      <h3 class="text-subtitle-2 text-grey mb-2">Nabywca</h3>
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Nazwa</div>
          <div class="text-body-1">{{ invoice.podmiot2.daneIdentyfikacyjne.nazwa }}</div>
        </v-col>
        <v-col cols="12" md="6" v-if="invoice.podmiot2.daneIdentyfikacyjne.nip">
          <div class="text-caption text-grey">NIP</div>
          <div class="text-body-1">{{ invoice.podmiot2.daneIdentyfikacyjne.nip }}</div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Pozycje -->
      <h3 class="text-subtitle-2 text-grey mb-2">Pozycje faktury</h3>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Lp.</th>
            <th>Nazwa</th>
            <th class="text-right">Ilość</th>
            <th class="text-right">Cena netto</th>
            <th class="text-right">VAT</th>
            <th class="text-right">Brutto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.body.fa.pozycje" :key="item.numerWiersza">
            <td>{{ item.numerWiersza }}</td>
            <td>{{ item.nazwa }}</td>
            <td class="text-right">{{ item.ilosc }}</td>
            <td class="text-right">{{ formatCurrency(item.cenaNetto) }}</td>
            <td class="text-right">{{ item.stawkaVat }}</td>
            <td class="text-right font-weight-medium">{{ formatCurrency(item.wartoscBrutto) }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-divider class="my-4" />

      <!-- Podsumowanie -->
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Waluta</div>
          <div class="text-body-1">{{ invoice.body.fa.waluta }}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-caption text-grey">Suma brutto</div>
          <div class="text-h6 text-primary font-weight-bold">
            {{ formatCurrency(invoice.body.fa.kwotaBrutto) }} {{ invoice.body.fa.waluta }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="emit('close')">Zamknij</v-btn>
      <v-btn color="primary" variant="tonal" :disabled="!invoice" @click="handleEdit">
        <v-icon start>mdi-pencil</v-icon>
        Edytuj
      </v-btn>
      <v-btn color="error" variant="text" :loading="deleting" :disabled="!invoice" @click="handleDelete">
        <v-icon start>mdi-delete</v-icon>
        Usuń
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface InvoicePosition {
  numerWiersza: number;
  nazwa: string;
  ilosc: number;
  cenaNetto: number;
  stawkaVat: string;
  wartoscNetto: number;
  kwotaVat: number;
  wartoscBrutto: number;
}

export interface InvoiceDraft {
  id?: string;
  podmiot1: {
    daneIdentyfikacyjne: { nip: string; nazwa: string };
    adres: { adresL1: string; adresL2?: string };
  };
  podmiot2: {
    daneIdentyfikacyjne: { nazwa: string; nip?: string };
  };
  body: {
    fa: {
      waluta: string;
      dataWystawienia: string;
      numerFaktury: string;
      kwotaBrutto: number;
      pozycje: InvoicePosition[];
    };
  };
}

const props = defineProps<{
  invoice: InvoiceDraft | null;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", invoice: InvoiceDraft): void;
  (e: "delete", invoice: InvoiceDraft): void;
  (e: "close"): void;
}>();

const formatCurrency = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return "0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("pl-PL");
  } catch {
    return dateString;
  }
};

const handleEdit = (): void => {
  if (props.invoice) emit("edit", props.invoice);
};

const handleDelete = (): void => {
  if (props.invoice) emit("delete", props.invoice);
};
</script>
