<template>
    <v-container fluid class="pa-4">
        <!-- Header z szybkim filtrem -->
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-6">
            <div>
                <h1 class="text-h3 font-weight-bold mb-1" style="color: #2d3436; letter-spacing: -0.5px;">
                    Faktury
                </h1>
                <div class="d-flex flex-wrap gap-2 mt-3">
                    <v-chip variant="outlined" color="grey-darken-1">
                        <v-icon start size="small">mdi:mdi-counter</v-icon>
                        {{ invoices.length }} faktur
                    </v-chip>
                    <v-chip variant="outlined" color="green">
                        <v-icon start size="small">mdi:mdi-cash</v-icon>
                        {{ formatCurrency(totalAmount) }}
                    </v-chip>
                </div>
            </div>

            <div class="mt-4 mt-md-0 d-flex flex-wrap gap-2">
                <v-btn
                    variant="outlined"
                    color="grey-darken-1"
                    prepend-icon="mdi:mdi-filter-variant"
                    @click="showFilters = !showFilters"
                >
                    Filtry
                </v-btn>
                <v-btn
                    color="#d63031"
                    prepend-icon="mdi:mdi-plus"
                    @click="openCreateDialog"
                >
                    Nowa faktura
                </v-btn>
            </div>
        </div>

        <!-- Rozwijane filtry -->
        <v-expand-transition>
            <v-card v-if="showFilters" class="mb-6" elevation="1">
                <v-card-text class="pa-4">
                    <v-row>
                        <v-col cols="12" md="6">
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
                        <v-col cols="12" md="4">
                            <v-select
                                v-model="filterType"
                                :items="invoiceTypes"
                                label="Rodzaj faktury"
                                variant="outlined"
                                density="compact"
                                hide-details
                                clearable
                            />
                        </v-col>
                        <v-col cols="12" md="2" class="d-flex align-center">
                            <v-btn
                                variant="text"
                                color="error"
                                :disabled="selected.length === 0"
                                @click="confirmDelete(selected)"
                                block
                            >
                                Usuń ({{ selected.length }})
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-expand-transition>

        <!-- Informacje o zaznaczeniu -->
        <v-slide-y-transition>
            <v-card v-if="selected.length > 0" color="grey-lighten-4" class="mb-4">
                <v-card-text class="pa-3 d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-icon color="#d63031" class="mr-2">mdi:mdi-check-circle</v-icon>
                        <span class="font-weight-medium">Zaznaczono {{ selected.length }} faktur</span>
                    </div>
                    <v-btn variant="text" size="small" @click="selected = []">
                        Wyczyść
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-slide-y-transition>

        <!-- Kafelki faktur -->
        <v-row v-if="!loading && filteredInvoices.length > 0" class="mb-6">
            <v-col
                v-for="invoice in filteredInvoices"
                :key="invoice.id"
                cols="12"
                sm="6"
                lg="4"
            >
                <v-card
                    class="invoice-tile"
                    :class="{ 'selected-invoice': selected.some(s => s.id === invoice.id) }"
                    @click="toggleSelect(invoice)"
                    elevation="2"
                    hover
                >
                    <div class="d-flex justify-space-between align-start pa-4">
                        <div>
                            <v-checkbox-btn
                                :model-value="selected.some(s => s.id === invoice.id)"
                                @click.stop="toggleSelect(invoice)"
                                color="#d63031"
                                density="compact"
                                hide-details
                                class="mr-2"
                            />
                        </div>
                        <div class="d-flex gap-1">
                            <v-btn
                                size="small"
                                variant="text"
                                icon
                                @click.stop="openDetailsDialog(invoice)"
                                color="grey-darken-1"
                            >
                                <v-icon>mdi:mdi-eye-outline</v-icon>
                            </v-btn>
                            <v-btn
                                size="small"
                                variant="text"
                                icon
                                @click.stop="downloadPDF(invoice)"
                                color="blue-darken-1"
                            >
                                <v-icon>mdi:mdi-file-pdf-box</v-icon>
                            </v-btn>
                            <v-btn
                                size="small"
                                variant="text"
                                icon
                                @click.stop="confirmDelete([invoice])"
                                color="error"
                            >
                                <v-icon>mdi:mdi-delete-outline</v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <v-divider />

                    <v-card-text class="pa-4">
                        <!-- Nagłówek faktury -->
                        <div class="d-flex justify-space-between align-start mb-4">
                            <div>
                                <div class="text-h6 font-weight-bold mb-1">{{ invoice.fa.numerFaktury }}</div>
                                <v-chip
                                    size="small"
                                    :color="getInvoiceTypeColor(invoice.fa.rodzajFaktury)"
                                    :text-color="getInvoiceTypeTextColor(invoice.fa.rodzajFaktury)"
                                    class="font-weight-medium"
                                >
                                    {{ getInvoiceTypeLabel(invoice.fa.rodzajFaktury) }}
                                </v-chip>
                            </div>
                            <div class="text-right">
                                <div class="text-h5 font-weight-bold text-red-darken-2">
                                    {{ formatCurrency(parseFloat(invoice.fa.kwotaBrutto)) }}
                                </div>
                                <div class="text-caption text-grey">{{ invoice.fa.waluta }}</div>
                            </div>
                        </div>

                        <!-- Informacje o dacie -->
                        <div class="mb-4">
                            <div class="text-caption text-grey-darken-1 mb-1">Data wystawienia</div>
                            <div class="d-flex align-center">
                                <v-icon size="small" color="grey-darken-2" class="mr-1">mdi:mdi-calendar</v-icon>
                                <span class="font-weight-medium">{{ formatDate(invoice.fa.dataWystawienia) }}</span>
                                <v-chip v-if="invoice.fa.dataDostawy" size="x-small" variant="outlined" class="ml-2">
                                    Dostawa: {{ formatDate(invoice.fa.dataDostawy) }}
                                </v-chip>
                            </div>
                        </div>

                        <!-- Nabywca -->
                        <div class="mb-4">
                            <div class="text-caption text-grey-darken-1 mb-1">Nabywca</div>
                            <div class="font-weight-medium text-truncate">
                                {{ invoice.podmiot2.daneIdentyfikacyjne.nazwa || '-' }}
                            </div>
                            <div class="text-caption text-grey">
                                NIP: {{ invoice.podmiot2.daneIdentyfikacyjne.nip || 'Brak' }}
                            </div>
                        </div>

                        <!-- Podsumowanie pozycji -->
                        <div class="mb-3">
                            <div class="text-caption text-grey-darken-1 mb-1">Pozycje</div>
                            <div class="d-flex justify-space-between">
                                <div class="d-flex align-center">
                                    <v-icon size="small" color="grey-darken-2" class="mr-1">mdi:mdi-format-list-bulleted</v-icon>
                                    <span>{{ invoice.fa.pozycje.length }} pozycji</span>
                                </div>
                                <div v-if="invoice.fa.platnosc" class="text-caption text-grey">
                                    {{ getPaymentMethodLabel(invoice.fa.platnosc.formaPlatnosci) }}
                                </div>
                            </div>
                        </div>

                        <!-- Adnotacje -->
                        <div v-if="hasAnnotations(invoice)" class="mt-3 pt-3 border-top">
                            <div class="text-caption text-grey-darken-1 mb-1">Adnotacje</div>
                            <div class="d-flex flex-wrap gap-1">
                                <v-chip v-if="invoice.fa.adnotacje.splitPayment === 1" size="x-small" color="red-lighten-5" text-color="red-darken-3">
                                    Split payment
                                </v-chip>
                                <v-chip v-if="invoice.fa.adnotacje.odwrotneObciazenie === 1" size="x-small" color="blue-lighten-5" text-color="blue-darken-3">
                                    Odwrotne obciążenie
                                </v-chip>
                                <v-chip v-if="invoice.fa.adnotacje.metodaKasowa === 1" size="x-small" color="green-lighten-5" text-color="green-darken-3">
                                    Metoda kasowa
                                </v-chip>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Brak faktur -->
        <v-card v-else-if="!loading" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi:mdi-file-document-outline</v-icon>
            <div class="text-h6 text-grey-darken-1 mb-2">Brak faktur</div>
            <p class="text-grey mb-4">Nie znaleziono faktur spełniających kryteria wyszukiwania</p>
            <v-btn color="#d63031" @click="openCreateDialog">
                Dodaj pierwszą fakturę
            </v-btn>
        </v-card>

        <!-- Loading -->
        <v-card v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="#d63031" size="64" />
            <div class="text-h6 text-grey-darken-1 mt-4">Ładowanie faktur...</div>
        </v-card>

        <!-- Dialog tworzenia faktury (uproszczony) -->
        <v-dialog v-model="createDialog" max-width="800">
            <v-card>
                <v-toolbar color="#d63031" dark>
                    <v-toolbar-title>Nowa faktura</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="createDialog = false">
                        <v-icon>mdi:mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                
                <v-card-text class="pa-6">
                    <v-form v-model="validForm" @submit.prevent="createInvoice">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newInvoice.fa.numerFaktury"
                                    label="Numer faktury *"
                                    variant="outlined"
                                    required
                                    :rules="[v => !!v || 'Numer faktury jest wymagany']"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="newInvoice.fa.rodzajFaktury"
                                    :items="invoiceTypes"
                                    label="Rodzaj faktury *"
                                    variant="outlined"
                                    required
                                    :rules="[v => !!v || 'Rodzaj faktury jest wymagany']"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newInvoice.fa.dataWystawienia"
                                    type="date"
                                    label="Data wystawienia *"
                                    variant="outlined"
                                    required
                                    :rules="[v => !!v || 'Data wystawienia jest wymagana']"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="newInvoice.fa.waluta"
                                    :items="currencyOptions"
                                    label="Waluta *"
                                    variant="outlined"
                                    required
                                    :rules="[v => !!v || 'Waluta jest wymagana']"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12">
                                <div class="text-h6 mb-4">Dane nabywcy</div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newInvoice.podmiot2.daneIdentyfikacyjne.nazwa"
                                    label="Nazwa nabywcy *"
                                    variant="outlined"
                                    required
                                    :rules="[v => !!v || 'Nazwa nabywcy jest wymagana']"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newInvoice.podmiot2.daneIdentyfikacyjne.nip"
                                    label="NIP nabywcy"
                                    variant="outlined"
                                    class="mb-4"
                                />
                            </v-col>
                            <v-col cols="12">
                                <div class="d-flex justify-space-between align-center mb-4">
                                    <div class="text-h6">Pozycje faktury</div>
                                    <v-btn size="small" color="#d63031" @click="addInvoiceItem">
                                        <v-icon start>mdi:mdi-plus</v-icon>
                                        Dodaj pozycję
                                    </v-btn>
                                </div>
                                
                                <v-card v-for="(item, index) in newInvoice.fa.pozycje" :key="index" class="mb-3">
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" md="5">
                                                <v-text-field
                                                    v-model="item.nazwa"
                                                    label="Nazwa towaru/usługi *"
                                                    variant="outlined"
                                                    density="compact"
                                                    required
                                                    :rules="[v => !!v || 'Nazwa jest wymagana']"
                                                />
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    v-model="item.ilosc"
                                                    label="Ilość *"
                                                    variant="outlined"
                                                    density="compact"
                                                    type="number"
                                                    required
                                                    :rules="[v => !!v || 'Ilość jest wymagana']"
                                                />
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    v-model="item.jednostkaMiary"
                                                    label="Jednostka"
                                                    variant="outlined"
                                                    density="compact"
                                                />
                                            </v-col>
                                            <v-col cols="6" md="2">
                                                <v-text-field
                                                    v-model="item.cenaJednostkowaNetto"
                                                    label="Cena netto *"
                                                    variant="outlined"
                                                    density="compact"
                                                    type="number"
                                                    required
                                                    :rules="[v => !!v || 'Cena netto jest wymagana']"
                                                />
                                            </v-col>
                                            <v-col cols="6" md="1">
                                                <v-btn
                                                    size="small"
                                                    variant="text"
                                                    color="error"
                                                    icon
                                                    @click="removeInvoiceItem(index)"
                                                    class="mt-2"
                                                >
                                                    <v-icon>mdi:mdi-delete</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                
                                <div v-if="newInvoice.fa.pozycje.length > 0" class="mt-6">
                                    <div class="text-h6 mb-2">Podsumowanie</div>
                                    <v-table>
                                        <thead>
                                            <tr>
                                                <th>Pozycja</th>
                                                <th class="text-right">Wartość netto</th>
                                                <th class="text-right">Wartość brutto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in newInvoice.fa.pozycje" :key="index">
                                                <td>{{ item.nazwa }}</td>
                                                <td class="text-right">{{ calculateNetValue(item) }} {{ newInvoice.fa.waluta }}</td>
                                                <td class="text-right font-weight-bold">{{ calculateGrossValue(item) }} {{ newInvoice.fa.waluta }}</td>
                                            </tr>
                                            <tr>
                                                <td class="font-weight-bold">RAZEM</td>
                                                <td class="text-right font-weight-bold">{{ calculateTotalNet() }} {{ newInvoice.fa.waluta }}</td>
                                                <td class="text-right font-weight-bold text-red-darken-2">{{ calculateTotalGross() }} {{ newInvoice.fa.waluta }}</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </div>
                            </v-col>
                        </v-row>
                        
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn
                                variant="text"
                                @click="createDialog = false"
                            >
                                Anuluj
                            </v-btn>
                            <v-btn
                                color="#d63031"
                                type="submit"
                                :loading="creating"
                                :disabled="!validForm || newInvoice.fa.pozycje.length === 0"
                            >
                                Utwórz fakturę
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Dialog szczegółów faktury -->
        <v-dialog v-model="detailsDialog" max-width="800">
            <v-card v-if="selectedInvoice">
                <v-toolbar color="#d63031" dark>
                    <v-toolbar-title>Faktura {{ selectedInvoice.fa.numerFaktury }}</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="detailsDialog = false">
                        <v-icon>mdi:mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                
                <v-card-text class="pa-6">
                    <v-row class="mb-4">
                        <v-col cols="6">
                            <div class="text-subtitle-1 font-weight-bold mb-2">Sprzedawca</div>
                            <div>{{ selectedInvoice.podmiot1.daneIdentyfikacyjne.nazwa }}</div>
                            <div class="text-caption text-grey">NIP: {{ selectedInvoice.podmiot1.daneIdentyfikacyjne.nip }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="text-subtitle-1 font-weight-bold mb-2">Nabywca</div>
                            <div>{{ selectedInvoice.podmiot2.daneIdentyfikacyjne.nazwa || '-' }}</div>
                            <div class="text-caption text-grey">NIP: {{ selectedInvoice.podmiot2.daneIdentyfikacyjne.nip || 'Brak' }}</div>
                        </v-col>
                    </v-row>

                    <v-row class="mb-4">
                        <v-col cols="4">
                            <div class="text-caption text-grey-darken-1">Numer faktury</div>
                            <div class="text-body-1 font-weight-bold">{{ selectedInvoice.fa.numerFaktury }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-caption text-grey-darken-1">Data wystawienia</div>
                            <div class="text-body-1">{{ formatDate(selectedInvoice.fa.dataWystawienia) }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-caption text-grey-darken-1">Rodzaj faktury</div>
                            <v-chip size="small" :color="getInvoiceTypeColor(selectedInvoice.fa.rodzajFaktury)" 
                                   :text-color="getInvoiceTypeTextColor(selectedInvoice.fa.rodzajFaktury)">
                                {{ getInvoiceTypeLabel(selectedInvoice.fa.rodzajFaktury) }}
                            </v-chip>
                        </v-col>
                    </v-row>

                    <div class="mb-4">
                        <div class="text-subtitle-1 font-weight-bold mb-2">Pozycje faktury</div>
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Lp.</th>
                                    <th>Nazwa</th>
                                    <th class="text-right">Ilość</th>
                                    <th class="text-right">Cena netto</th>
                                    <th class="text-right">Wartość netto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="pozycja in selectedInvoice.fa.pozycje" :key="pozycja.numerWiersza">
                                    <td>{{ pozycja.numerWiersza }}</td>
                                    <td>{{ pozycja.nazwa }}</td>
                                    <td class="text-right">{{ pozycja.ilosc }} {{ pozycja.jednostkaMiary }}</td>
                                    <td class="text-right">{{ pozycja.cenaJednostkowaNetto }} {{ selectedInvoice.fa.waluta }}</td>
                                    <td class="text-right">{{ pozycja.wartoscNetto }} {{ selectedInvoice.fa.waluta }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>

                    <v-row class="mt-6">
                        <v-col cols="8">
                            <div v-if="selectedInvoice.fa.platnosc">
                                <div class="text-subtitle-2 text-grey-darken-1 mb-1">Płatność</div>
                                <div>{{ getPaymentMethodLabel(selectedInvoice.fa.platnosc.formaPlatnosci) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <div class="text-h5 font-weight-bold text-red-darken-2">
                                {{ selectedInvoice.fa.kwotaBrutto }} {{ selectedInvoice.fa.waluta }}
                            </div>
                            <div class="text-caption text-grey-darken-1">Kwota brutto</div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn
                        color="#d63031"
                        @click="downloadPDF(selectedInvoice)"
                        prepend-icon="mdi:mdi-file-pdf-box"
                    >
                        Pobierz PDF
                    </v-btn>
                    <v-btn
                        variant="outlined"
                        color="error"
                        @click="confirmDelete([selectedInvoice])"
                        prepend-icon="mdi:mdi-delete"
                    >
                        Usuń
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog potwierdzenia usunięcia -->
        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card>
                <v-card-title class="text-h6">Potwierdź usunięcie</v-card-title>
                <v-card-text>
                    Czy na pewno chcesz usunąć {{ deleteTargets.length }} faktur? Ta operacja jest nieodwracalna.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="deleteDialog = false">Anuluj</v-btn>
                    <v-btn color="error" :loading="deleting" @click="deleteInvoices">Usuń</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar -->
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
import { client, getAuthHeaders } from "../../api";

// Typy (takie same jak w Wersji 1)
interface InvoiceAddress {
    kodKraju: string;
    adresL1: string;
    adresL2?: string;
}

interface InvoiceParty {
    daneIdentyfikacyjne: {
        nip: string;
        nazwa: string;
    };
    adres: InvoiceAddress;
}

interface InvoiceItem {
    numerWiersza: number;
    nazwa: string;
    jednostkaMiary?: string;
    ilosc?: string;
    cenaJednostkowaNetto?: string;
    wartoscNetto?: string;
    stawkaVat?: string;
    kwotaVat?: string;
    wartoscBrutto?: string;
}

interface InvoiceAnnotations {
    metodaKasowa: number;
    samofakturowanie: number;
    odwrotneObciazenie: number;
    splitPayment: number;
    zwolnienie: any;
    noweSrodkiTransportu: any;
    proceduraUproszczonaWNT: number;
    proceduraMarzy: any;
}

interface InvoicePayment {
    formaPlatnosci?: string;
    opisPlatnosci?: string;
    terminPlatnosci?: Array<{ termin?: string }>;
}

interface InvoiceData {
    waluta: string;
    dataWystawienia: string;
    numerFaktury: string;
    kwotaBrutto: string;
    adnotacje: InvoiceAnnotations;
    rodzajFaktury: string;
    pozycje: InvoiceItem[];
    dataDostawy?: string;
    miejsceWystawienia?: string;
    platnosc?: InvoicePayment;
}

interface Invoice {
    id: string;
    podmiot1: InvoiceParty;
    podmiot2: any;
    fa: InvoiceData;
}

// Dane
const loading = ref(false);
const creating = ref(false);
const deleting = ref(false);
const search = ref("");
const filterType = ref<string | null>(null);
const detailsDialog = ref(false);
const createDialog = ref(false);
const deleteDialog = ref(false);
const showFilters = ref(true);
const validForm = ref(false);

const invoices = ref<Invoice[]>([]);
const selected = ref<Invoice[]>([]);
const selectedInvoice = ref<Invoice | null>(null);
const deleteTargets = ref<Invoice[]>([]);

// Nowa faktura
const newInvoice = reactive({
    podmiot1: {
        daneIdentyfikacyjne: {
            nip: "1234567890",
            nazwa: "Moja Firma Sp. z o.o."
        },
        adres: {
            kodKraju: "PL",
            adresL1: "ul. Przykładowa 123",
            adresL2: "00-000 Warszawa"
        }
    },
    podmiot2: {
        daneIdentyfikacyjne: {
            nip: "",
            nazwa: ""
        },
        adres: {
            kodKraju: "PL",
            adresL1: "",
            adresL2: ""
        },
        jst: 1,
        gv: 1
    },
    fa: {
        waluta: "PLN",
        dataWystawienia: new Date().toISOString().split('T')[0],
        numerFaktury: "",
        kwotaBrutto: "0",
        adnotacje: {
            metodaKasowa: 2,
            samofakturowanie: 2,
            odwrotneObciazenie: 2,
            splitPayment: 2,
            zwolnienie: {},
            noweSrodkiTransportu: {},
            proceduraUproszczonaWNT: 2,
            proceduraMarzy: {}
        },
        rodzajFaktury: "VAT",
        pozycje: [] as InvoiceItem[],
        dataDostawy: undefined,
        miejsceWystawienia: "Warszawa",
        platnosc: undefined
    }
});

// Opcje
const invoiceTypes = [
    { title: "Faktura VAT", value: "VAT" },
    { title: "Faktura korygująca", value: "KOREKTA" },
    { title: "Faktura zaliczkowa", value: "ZALICZKA" },
    { title: "Faktura końcowa", value: "KONCOWA" },
    { title: "Faktura proforma", value: "PROFORMA" },
];

const currencyOptions = [
    { title: "PLN - Złoty polski", value: "PLN" },
    { title: "EUR - Euro", value: "EUR" },
    { title: "USD - Dolar amerykański", value: "USD" },
    { title: "GBP - Funt brytyjski", value: "GBP" },
];

const snackbar = reactive({
    show: false,
    message: "",
    color: "success",
});

// Obliczenia
const totalAmount = computed(() => {
    return invoices.value.reduce((sum, invoice) => {
        return sum + parseFloat(invoice.fa.kwotaBrutto || "0");
    }, 0);
});

const filteredInvoices = computed(() => {
    let filtered = invoices.value;
    
    if (filterType.value) {
        filtered = filtered.filter(invoice => invoice.fa.rodzajFaktury === filterType.value);
    }
    
    if (search.value) {
        const searchLower = search.value.toLowerCase();
        filtered = filtered.filter(invoice => 
            invoice.fa.numerFaktury.toLowerCase().includes(searchLower) ||
            invoice.podmiot2.daneIdentyfikacyjne.nazwa?.toLowerCase().includes(searchLower)
        );
    }
    
    return filtered;
});

// Funkcje pomocnicze
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2
    }).format(amount);
};

const getInvoiceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
        'VAT': 'green-lighten-5',
        'KOREKTA': 'orange-lighten-5',
        'ZALICZKA': 'blue-lighten-5',
        'KONCOWA': 'purple-lighten-5',
        'PROFORMA': 'grey-lighten-5'
    };
    return colors[type] || 'grey-lighten-5';
};

const getInvoiceTypeTextColor = (type: string) => {
    const colors: Record<string, string> = {
        'VAT': 'green-darken-3',
        'KOREKTA': 'orange-darken-3',
        'ZALICZKA': 'blue-darken-3',
        'KONCOWA': 'purple-darken-3',
        'PROFORMA': 'grey-darken-3'
    };
    return colors[type] || 'grey-darken-3';
};

const getInvoiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'VAT': 'VAT',
        'KOREKTA': 'Korekta',
        'ZALICZKA': 'Zaliczka',
        'KONCOWA': 'Końcowa',
        'PROFORMA': 'Proforma'
    };
    return labels[type] || type;
};

const getPaymentMethodLabel = (method?: string) => {
    const methods: Record<string, string> = {
        'GOTOWKA': 'Gotówka',
        'KARTA': 'Karta',
        'PRZELEW': 'Przelew',
        'CZECK': 'Czek'
    };
    return method ? methods[method] || method : 'Brak info';
};

const hasAnnotations = (invoice: Invoice) => {
    const adnotacje = invoice.fa.adnotacje;
    return adnotacje.splitPayment === 1 || 
           adnotacje.odwrotneObciazenie === 1 || 
           adnotacje.metodaKasowa === 1;
};

const calculateNetValue = (item: InvoiceItem) => {
    const quantity = parseFloat(item.ilosc || "0");
    const price = parseFloat(item.cenaJednostkowaNetto || "0");
    return (quantity * price).toFixed(2);
};

const calculateGrossValue = (item: InvoiceItem) => {
    const netValue = parseFloat(calculateNetValue(item));
    // Dla uproszczenia zakładamy 23% VAT
    const vatValue = netValue * 0.23;
    return (netValue + vatValue).toFixed(2);
};

const calculateTotalNet = () => {
    return newInvoice.fa.pozycje.reduce((total, item) => {
        return total + parseFloat(calculateNetValue(item));
    }, 0).toFixed(2);
};

const calculateTotalGross = () => {
    return newInvoice.fa.pozycje.reduce((total, item) => {
        return total + parseFloat(calculateGrossValue(item));
    }, 0).toFixed(2);
};

// Operacje na pozycjach faktury
const addInvoiceItem = () => {
    newInvoice.fa.pozycje.push({
        numerWiersza: newInvoice.fa.pozycje.length + 1,
        nazwa: "",
        jednostkaMiary: "szt.",
        ilosc: "1",
        cenaJednostkowaNetto: "0",
        stawkaVat: "23"
    });
};

const removeInvoiceItem = (index: number) => {
    newInvoice.fa.pozycje.splice(index, 1);
    newInvoice.fa.pozycje.forEach((item, idx) => {
        item.numerWiersza = idx + 1;
    });
};

// Funkcje interakcji
const toggleSelect = (invoice: Invoice) => {
    const index = selected.value.findIndex(s => s.id === invoice.id);
    if (index > -1) {
        selected.value.splice(index, 1);
    } else {
        selected.value.push(invoice);
    }
};

const openDetailsDialog = (invoice: Invoice) => {
    selectedInvoice.value = invoice;
    detailsDialog.value = true;
};

const openCreateDialog = () => {
    resetNewInvoice();
    createDialog.value = true;
};

const resetNewInvoice = () => {
    Object.assign(newInvoice, {
        podmiot1: {
            daneIdentyfikacyjne: {
                nip: "1234567890",
                nazwa: "Moja Firma Sp. z o.o."
            },
            adres: {
                kodKraju: "PL",
                adresL1: "ul. Przykładowa 123",
                adresL2: "00-000 Warszawa"
            }
        },
        podmiot2: {
            daneIdentyfikacyjne: {
                nip: "",
                nazwa: ""
            },
            adres: {
                kodKraju: "PL",
                adresL1: "",
                adresL2: ""
            },
            jst: 1,
            gv: 1
        },
        fa: {
            waluta: "PLN",
            dataWystawienia: new Date().toISOString().split('T')[0],
            numerFaktury: "",
            kwotaBrutto: "0",
            adnotacje: {
                metodaKasowa: 2,
                samofakturowanie: 2,
                odwrotneObciazenie: 2,
                splitPayment: 2,
                zwolnienie: {},
                noweSrodkiTransportu: {},
                proceduraUproszczonaWNT: 2,
                proceduraMarzy: {}
            },
            rodzajFaktury: "VAT",
            pozycje: [] as InvoiceItem[],
            dataDostawy: undefined,
            miejsceWystawienia: "Warszawa",
            platnosc: undefined
        }
    });
};

// API Operations
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
        showSnackbar("Wystąpił błąd podczas pobierania faktur", "error");
    } finally {
        loading.value = false;
    }
};

const createInvoice = async () => {
    if (!validForm.value || newInvoice.fa.pozycje.length === 0) return;
    
    creating.value = true;
    try {
        // Oblicz kwoty
        newInvoice.fa.pozycje.forEach(item => {
            const netValue = parseFloat(calculateNetValue(item));
            const vatValue = netValue * 0.23; // 23% VAT
            
            item.wartoscNetto = netValue.toFixed(2);
            item.kwotaVat = vatValue.toFixed(2);
            item.wartoscBrutto = (netValue + vatValue).toFixed(2);
        });
        
        const totalGross = newInvoice.fa.pozycje.reduce((sum, item) => {
            return sum + parseFloat(item.wartoscBrutto || "0");
        }, 0);
        newInvoice.fa.kwotaBrutto = totalGross.toFixed(2);
        
        const response = await client.invoicesCreate({
            body: newInvoice,
            headers: getAuthHeaders(),
        });
        
        if (response.status === 200) {
            showSnackbar("Faktura została dodana", "success");
            await fetchInvoices();
            resetNewInvoice();
            createDialog.value = false;
        } else {
            showSnackbar("Nie udało się dodać faktury", "error");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas dodawania faktury", "error");
    } finally {
        creating.value = false;
    }
};

const confirmDelete = (targets: Invoice[]) => {
    deleteTargets.value = targets;
    deleteDialog.value = true;
};

const deleteInvoices = async () => {
    if (!deleteTargets.value.length) return;
    deleting.value = true;
    try {
        await Promise.all(
            deleteTargets.value.map((invoice) =>
                client.invoicesDelete({
                    params: { id: invoice.id },
                    headers: getAuthHeaders(),
                })
            )
        );
        showSnackbar("Usunięto wybrane faktury", "success");
        await fetchInvoices();
        selected.value = [];
        if (selectedInvoice.value && deleteTargets.value.some((i) => i.id === selectedInvoice.value!.id)) {
            selectedInvoice.value = null;
            detailsDialog.value = false;
        }
        deleteDialog.value = false;
        deleteTargets.value = [];
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas usuwania", "error");
    } finally {
        deleting.value = false;
    }
};

const downloadPDF = async (invoice: Invoice) => {
    try {
        const response = await client.invoicesDownload({
            params: { id: invoice.id },
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            const blob = new Blob([response.body], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `faktura_${invoice.fa.numerFaktury}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showSnackbar("PDF został pobrany", "success");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas pobierania PDF", "error");
    }
};

const showSnackbar = (message: string, color: string) => {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.show = true;
};

onMounted(() => {
    fetchInvoices();
});
</script>

<style scoped>
.invoice-tile {
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
    height: 100%;
}

.invoice-tile:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.selected-invoice {
    border-color: #d63031;
    background-color: rgba(214, 48, 49, 0.05);
}

.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.border-top {
    border-top: 1px solid #e0e0e0;
}

.gap-1 {
    gap: 4px;
}

:deep(.v-table th) {
    font-weight: 600 !important;
    color: #2d3436 !important;
    text-transform: uppercase;
    font-size: 0.75rem !important;
}
</style>