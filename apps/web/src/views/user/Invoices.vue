<template>
  <v-container fluid>
    <!-- HEADER -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Faktury</h1>
        <p class="text-subtitle-1 text-grey">Zarządzaj listą faktur</p>
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-btn color="primary" variant="tonal" @click="openCreate">
          <v-icon start>mdi-plus</v-icon>
          Dodaj fakturę
        </v-btn>
      </v-col>
    </v-row>

    <!-- SEARCH -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Szukaj..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card :loading="loading">
      <v-data-table
        :headers="headers"
        :items="filteredInvoices"
        item-value="id"
        hover
        class="elevation-1"
      >
        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item)" size="small" variant="tonal">
            {{ getStatusText(item) }}
          </v-chip>
        </template>

        <!-- Kwota -->
        <template #item.body.fa.kwotaBrutto="{ item }">
          {{ formatCurrency(item.body.fa.kwotaBrutto) }} {{ item.body.fa.waluta }}
        </template>

        <!-- Data -->
        <template #item.body.fa.dataWystawienia="{ item }">
          {{ formatDate(item.body.fa.dataWystawienia) }}
        </template>

        <!-- Akcje -->
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" @click="openDetails(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="primary"
            :disabled="!item.draft"
            @click="openEdit(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="success"
            :disabled="!item.draft"
            @click="confirmSave(item)"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="error"
            :disabled="item.signed || !!item.sessionReferenceNumber"
            @click="confirmDelete(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" variant="tonal" class="ma-4">
            Brak faktur do wyświetlenia. Dodaj pierwszą fakturę!
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- CREATE / EDIT DIALOG -->
    <v-dialog v-model="formDialog" max-width="1200" persistent scrollable>
      <InvoiceForm
        v-if="formDialog"
        ref="invoiceFormRef"
        :invoice="formInvoice"
        :loading="saving"
        @save="handleSave"
        @close="closeFormDialog"
      />
    </v-dialog>

    <!-- DETAILS DIALOG -->
    <v-dialog v-model="detailsDialog" max-width="900" scrollable>
      <InvoiceDetailsComponent
        v-if="detailsDialog"
        :invoice="detailsInvoice"
        :deleting="deleting"
        @edit="openEditFromDetails"
        @delete="handleDeleteFromDetails"
        @close="closeDetailsDialog"
      />
    </v-dialog>

    <!-- DELETE CONFIRMATION -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Potwierdź usunięcie</v-card-title>
        <v-card-text>
          Czy na pewno chcesz usunąć fakturę
          <strong>{{ invoiceToDelete?.body.fa.numerFaktury }}</strong>?
          <br />
          Tej operacji nie można cofnąć.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Anuluj</v-btn>
          <v-btn color="error" :loading="deleting" @click="executeDelete">
            Usuń
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SAVE CONFIRMATION -->
    <v-dialog v-model="saveDialog" max-width="450">
      <v-card>
        <v-card-title>Potwierdź zapis faktury</v-card-title>
        <v-card-text>
          <v-alert type="warning" variant="tonal" class="mb-4">
            <strong>Uwaga!</strong> Po zapisaniu faktury nie będzie możliwości jej edycji.
          </v-alert>
          Czy na pewno chcesz trwale zapisać fakturę
          <strong>{{ invoiceToSave?.body.fa.numerFaktury }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="saveDialog = false">Anuluj</v-btn>
          <v-btn color="success" :loading="savingPermanent" @click="executeSave">
            Zapisz trwale
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR -->
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
import InvoiceForm from "../../components/invoices/InvoiceCreate.vue";
import InvoiceDetailsComponent from "../../components/invoices/InvoiceDetails.vue";

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
      waluta: string;
      dataWystawienia: string;
      numerFaktury: string;
      kwotaBrutto: number;
      pozycje: InvoicePosition[];
    };
  };
}

// ============================================
// STAN
// ============================================

const invoices = ref<InvoiceDraft[]>([]);
const search = ref("");
const loading = ref(false);

const formInvoice = ref<InvoiceDraft | null>(null);
const detailsInvoice = ref<InvoiceDraft | null>(null);
const invoiceToDelete = ref<InvoiceDraft | null>(null);
const invoiceToSave = ref<InvoiceDraft | null>(null);

const formDialog = ref(false);
const detailsDialog = ref(false);
const deleteDialog = ref(false);
const saveDialog = ref(false);

const saving = ref(false);
const savingPermanent = ref(false);
const deleting = ref(false);

const invoiceFormRef = ref<InstanceType<typeof InvoiceForm> | null>(null);

const snackbar = reactive({
  show: false,
  message: "",
  color: "success" as "success" | "error" | "warning",
});

// ============================================
// TABELA
// ============================================

const headers = [
  { title: "Nr faktury", key: "body.fa.numerFaktury" },
  { title: "Nabywca", key: "podmiot2.daneIdentyfikacyjne.nazwa" },
  { title: "Kwota", key: "body.fa.kwotaBrutto" },
  { title: "Data wystawienia", key: "body.fa.dataWystawienia" },
  { title: "Status", key: "status", sortable: false },
  { title: "Akcje", key: "actions", sortable: false, align: "center" as const },
];

// ============================================
// FUNKCJE POMOCNICZE
// ============================================

const formatCurrency = (value: number | undefined) => value?.toFixed(2) || "0.00";
const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString("pl-PL") : "-";
const getStatusColor = (inv: InvoiceDraft) => inv.signed ? "purple" : inv.sessionReferenceNumber ? "blue" : inv.draft ? "warning" : "success";
const getStatusText = (inv: InvoiceDraft) => inv.signed ? "Podpisana" : inv.sessionReferenceNumber ? "Wysłana do KSeF" : inv.draft ? "Wersja robocza" : "Zapisana";
const showSnackbar = (msg: string, color: "success" | "error" | "warning" = "success") => { 
  snackbar.message = msg; 
  snackbar.color = color; 
  snackbar.show = true; 
};

// ============================================
// FILTROWANIE
// ============================================

const filteredInvoices = computed(() => {
  if (!search.value) return invoices.value;
  const s = search.value.toLowerCase();
  return invoices.value.filter(inv => 
    inv.body.fa.numerFaktury.toLowerCase().includes(s) ||
    inv.podmiot2.daneIdentyfikacyjne.nazwa.toLowerCase().includes(s) ||
    (inv.podmiot2.daneIdentyfikacyjne.nip || "").includes(s)
  );
});

// ============================================
// DIALOGI
// ============================================

const openCreate = () => { 
  formInvoice.value = null; 
  formDialog.value = true; 
};

const openEdit = (inv: InvoiceDraft) => {
  formInvoice.value = JSON.parse(JSON.stringify(inv));
  formDialog.value = true;
};

const openDetails = (inv: InvoiceDraft) => { 
  detailsInvoice.value = { ...inv }; 
  detailsDialog.value = true; 
};

const openEditFromDetails = (inv: InvoiceDraft) => { 
  detailsDialog.value = false; 
  formInvoice.value = { ...inv }; 
  formDialog.value = true; 
};

const closeFormDialog = () => { 
  formDialog.value = false; 
  formInvoice.value = null; 
  invoiceFormRef.value?.reset?.(); 
};

const closeDetailsDialog = () => { 
  detailsDialog.value = false; 
  detailsInvoice.value = null; 
};

// ============================================
// CRUD OPERATIONS
// ============================================

const handleSave = (payload: InvoiceDraft) => {
  if (formInvoice.value?.id) {
    // UPDATE
    const idx = invoices.value.findIndex(i => i.id === formInvoice.value!.id);
    if (idx !== -1) {
      invoices.value[idx] = { ...payload, id: formInvoice.value.id };
    }
    showSnackbar("Faktura została zaktualizowana");
  } else {
    // CREATE
    const newInvoice = { 
      ...payload, 
      id: Date.now().toString(),
      draft: true
    };
    invoices.value.push(newInvoice);
    showSnackbar("Faktura została utworzona");
  }
  closeFormDialog();
};

const confirmDelete = (inv: InvoiceDraft) => { 
  invoiceToDelete.value = inv; 
  deleteDialog.value = true; 
};

const handleDeleteFromDetails = (inv: InvoiceDraft) => {
  invoiceToDelete.value = inv;
  detailsDialog.value = false;
  deleteDialog.value = true;
};

const executeDelete = () => {
  if (!invoiceToDelete.value) return;
  deleting.value = true;
  
  setTimeout(() => {
    invoices.value = invoices.value.filter(i => i.id !== invoiceToDelete.value!.id);
    showSnackbar("Faktura została usunięta");
    deleteDialog.value = false; 
    invoiceToDelete.value = null;
    deleting.value = false;
  }, 500);
};

const confirmSave = (inv: InvoiceDraft) => { 
  invoiceToSave.value = inv; 
  saveDialog.value = true; 
};

const executeSave = () => {
  if (!invoiceToSave.value) return;
  savingPermanent.value = true;
  
  setTimeout(() => {
    const idx = invoices.value.findIndex(i => i.id === invoiceToSave.value!.id);
    if (idx !== -1) {
      invoices.value[idx].draft = false;
    }
    showSnackbar("Faktura została trwale zapisana");
    saveDialog.value = false; 
    invoiceToSave.value = null;
    savingPermanent.value = false;
  }, 500);
};

// ============================================
// INIT MOCK DATA
// ============================================

onMounted(() => {
  invoices.value = [
    {
      id: "1",
      draft: true,
      podmiot1: { 
        daneIdentyfikacyjne: { nip: "1234567890", nazwa: "Firma A" }, 
        adres: { adresL1: "ul. Testowa 1", adresL2: "00-001 Warszawa" } 
      },
      podmiot2: { 
        daneIdentyfikacyjne: { nazwa: "Klient X", nip: "9876543210" } 
      },
      body: {
        fa: {
          waluta: "PLN",
          dataWystawienia: new Date().toISOString().split("T")[0],
          numerFaktury: "FV/2026/001",
          kwotaBrutto: 1235.61,
          pozycje: [
            { 
              numerWiersza: 1, 
              nazwa: "Produkt 1", 
              ilosc: 2, 
              cenaNetto: 500, 
              stawkaVat: "23%", 
              wartoscNetto: 1000, 
              kwotaVat: 230, 
              wartoscBrutto: 1230 
            },
            { 
              numerWiersza: 2, 
              nazwa: "Produkt 2", 
              ilosc: 1, 
              cenaNetto: 4.56, 
              stawkaVat: "23%", 
              wartoscNetto: 4.56, 
              kwotaVat: 1.05, 
              wartoscBrutto: 5.61 
            },
          ]
        }
      }
    }
  ];
});
</script>