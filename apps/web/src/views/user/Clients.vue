<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4">Kontrahenci</h1>
        <p class="text-subtitle-1 text-grey">Zarządzaj listą swoich kontrahentów</p>
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-btn color="#d63031" prepend-icon="mdi:mdi-plus" @click="openDialog()">
          Dodaj kontrahenta
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi:mdi-magnify"
          label="Szukaj kontrahenta..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filterType"
          :items="companyTypeOptions"
          label="Forma prawna"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
      </v-col>
    </v-row>

    <!-- Tabela kontrahentów -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredClients"
        :search="search"
        :loading="loading"
        hover
        class="elevation-1"
      >
        <!-- Typ kontrahenta -->
        <template #item.type="{ item }">
          <v-chip color="primary" size="small">
            {{ item.type }}
          </v-chip>
        </template>

        <!-- VAT -->
        <template #item.vat="{ item }">
          <v-chip :color="item.vat ? 'success' : 'grey'" size="small">
            {{ item.vat ? 'VAT' : 'Brak VAT' }}
          </v-chip>
        </template>

        <!-- NIP -->
        <template #item.nip="{ item }">
          <span class="font-weight-medium">{{ formatNip(item.nip) }}</span>
        </template>

        <!-- Adres -->
        <template #item.address="{ item }">
          <div>
            <div>{{ item.street }} {{ item.address }}</div>
            <div class="text-grey text-caption">{{ item.zipcode }} {{ item.city }}</div>
          </div>
        </template>

        <!-- Kontakt -->
        <template #item.contact="{ item }">
          <div>
            <div v-if="item.email">
              <v-icon size="small" class="mr-1">mdi:mdi-email</v-icon>
              {{ item.email }}
            </div>
            <div v-if="item.phone">
              <v-icon size="small" class="mr-1">mdi:mdi-phone</v-icon>
              {{ item.phone }}
            </div>
            <span v-if="!item.email && !item.phone" class="text-grey">Brak danych</span>
          </div>
        </template>

        <!-- Akcje -->
        <template #item.actions="{ item }">
          <v-btn size="small" variant="text" @click="openDialog(item)">
            <v-icon>mdi:mdi-pencil</v-icon>
          </v-btn>
          <v-btn size="small" variant="text" @click="confirmDelete(item)">
            <v-icon>mdi:mdi-delete</v-icon>
          </v-btn>
        </template>

        <!-- Brak danych -->
        <template #no-data>
          <v-alert type="info" variant="tonal" class="ma-4">
            Brak kontrahentów do wyświetlenia. Dodaj pierwszego kontrahenta!
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog dodawania/edycji kontrahenta -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <v-card-title class="text-h5">
          {{ editingClient ? 'Edytuj kontrahenta' : 'Dodaj nowego kontrahenta' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Nazwa -->
              <v-col cols="12">
                <v-text-field
                  v-model="clientForm.name"
                  label="Nazwa firmy / Imię i nazwisko"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- Forma prawna -->
              <v-col cols="12">
                <v-select
                  v-model="clientForm.type"
                  :items="companyTypeOptions"
                  label="Forma prawna"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- NIP -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.nip"
                  label="NIP"
                  :rules="[rules.required, rules.nip]"
                  variant="outlined"
                  maxlength="10"
                  counter
                />
              </v-col>

              <!-- REGON -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.regon"
                  label="REGON"
                  :rules="[rules.required, rules.regon]"
                  variant="outlined"
                  maxlength="14"
                  counter
                />
              </v-col>

              <!-- BDO -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.bdo"
                  label="BDO (opcjonalne)"
                  variant="outlined"
                  maxlength="20"
                />
              </v-col>

              <!-- KRS -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.krs"
                  label="KRS (opcjonalne)"
                  variant="outlined"
                  maxlength="10"
                />
              </v-col>

              <!-- Data rejestracji -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.registerDate"
                  label="Data rejestracji"
                  :rules="[rules.required]"
                  variant="outlined"
                  type="date"
                />
              </v-col>

              <!-- VAT -->
              <v-col cols="12" md="6">
                <v-switch
                  v-model="clientForm.vat"
                  label="Płatnik VAT"
                  color="primary"
                />
              </v-col>

              <!-- Ulica -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="clientForm.street"
                  label="Ulica"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- Numer -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.address"
                  label="Numer budynku/lokalu"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- Kod pocztowy -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.zipcode"
                  label="Kod pocztowy"
                  :rules="[rules.required, rules.zipcode]"
                  variant="outlined"
                  placeholder="00-000"
                  maxlength="6"
                />
              </v-col>

              <!-- Miasto -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.city"
                  label="Miasto"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- Kraj -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.country"
                  label="Kraj"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.email"
                  label="Email"
                  :rules="[rules.email]"
                  variant="outlined"
                  type="email"
                />
              </v-col>

              <!-- Telefon -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.phone"
                  label="Telefon"
                  :rules="[rules.phone]"
                  variant="outlined"
                  placeholder="+48123456789"
                  maxlength="13"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Anuluj</v-btn>
          <v-btn color="#d63031" :disabled="!formValid" :loading="saving" @click="saveClient">
            {{ editingClient ? 'Zapisz zmiany' : 'Dodaj' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog potwierdzenia usunięcia -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Potwierdź usunięcie</v-card-title>
        <v-card-text>
          Czy na pewno chcesz usunąć kontrahenta <strong>{{ clientToDelete?.name }}</strong>?
          Ta operacja jest nieodwracalna.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Anuluj</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteClient">Usuń</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar z powiadomieniami -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Zamknij</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { VForm } from 'vuetify/components'

// Typ firmy (zgodny z Company.ts)
const CompanyType = {
  JDG: "Jednoosobowa działalność gospodarcza",
  SC: "Spółka cywilna",
  SPJ: "Spółka jawna",
  SPP: "Spółka partnerska",
  SPK: "Spółka komandytowa",
  SKA: "Spółka komandytowo-akcyjna",
  SPZOO: "Spółka z ograniczoną odpowiedzialnością",
  PSA: "Prosta spółka akcyjna",
  SA: "Spółka akcyjna",
  SPOLDZ: "Spółdzielnia",
  FUNDACJA: "Fundacja",
  STOWARZYSZENIE: "Stowarzyszenie rejestrowe",
  SPZOZ: "Samodzielny publiczny zakład opieki zdrowotnej",
  JEDNOSTKA_BUDZETOWA: "Jednostka budżetowa",
  ODDZIAL_ZAGR: "Oddział przedsiębiorcy zagranicznego",
  INNE: "Inna forma prawna",
} as const

type CompanyType = typeof CompanyType[keyof typeof CompanyType]

// Interfejs kontrahenta (zgodny z Company.ts)
interface Client {
  id: string
  name: string
  type: CompanyType
  nip: string
  regon: string
  bdo?: string
  krs?: string
  street: string
  address: string
  zipcode: string
  city: string
  country: string
  registerDate: Date
  vat: boolean
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// Stan komponentu
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const filterType = ref<string | null>(null)
const dialog = ref(false)
const deleteDialog = ref(false)
const formValid = ref(false)
const form = ref<VForm | null>(null)

const editingClient = ref<Client | null>(null)
const clientToDelete = ref<Client | null>(null)

// Przykładowe dane (z poprawnymi NIP i REGON)
const clients = ref<Client[]>([
  {
    id: '1',
    name: 'ABC Sp. z o.o.',
    type: CompanyType.SPZOO as CompanyType,
    nip: '5260250274', // Poprawny NIP z sumą kontrolną
    regon: '123456785', // Poprawny REGON 9-cyfrowy
    bdo: 'BDO12345',
    krs: '0000123456',
    street: 'ul. Przykładowa',
    address: '10/2',
    zipcode: '00-001',
    city: 'Warszawa',
    country: 'Polska',
    registerDate: new Date('2020-01-15'),
    vat: true,
    email: 'kontakt@abc.pl',
    phone: '+48123456789',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jan Kowalski',
    type: CompanyType.JDG as CompanyType,
    nip: '7010014878', // Poprawny NIP z sumą kontrolną
    regon: '123456794', // Poprawny REGON 9-cyfrowy
    street: 'ul. Testowa',
    address: '5',
    zipcode: '30-001',
    city: 'Kraków',
    country: 'Polska',
    registerDate: new Date('2022-02-20'),
    vat: false,
    email: 'jan.kowalski@email.com',
    phone: null,
    created_at: '2024-02-20',
    updated_at: '2024-02-20'
  }
])

// Typy kontrahentów do filtrowania
const companyTypeOptions = Object.entries(CompanyType).map(([key, value]) => ({
  title: value,
  value: key
}))

// Nagłówki tabeli
const headers = [
  { title: 'Nazwa', key: 'name', sortable: true },
  { title: 'Forma prawna', key: 'type', sortable: true },
  { title: 'NIP', key: 'nip', sortable: true },
  { title: 'VAT', key: 'vat', sortable: true },
  { title: 'Adres', key: 'address', sortable: false },
  { title: 'Kontakt', key: 'contact', sortable: false },
  { title: 'Akcje', key: 'actions', sortable: false, align: 'center' as const }
]

// Formularz kontrahenta
const defaultForm = {
  name: '',
  type: CompanyType.JDG as CompanyType,
  nip: '',
  regon: '',
  bdo: '',
  krs: '',
  street: '',
  address: '',
  zipcode: '',
  city: '',
  country: 'Polska',
  registerDate: new Date(),
  vat: false,
  email: '',
  phone: ''
}

const clientForm = reactive({ ...defaultForm })

// Walidacja NIP - algorytm sumy kontrolnej
const validateNip = (nip: string): boolean => {
  if (!nip || !/^\d{10}$/.test(nip)) return false

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const digits = nip.split('').map(d => parseInt(d, 10))

  const sum = weights.reduce((acc, weight, index) => acc + weight * digits[index], 0)
  const checksum = sum % 11

  return checksum === digits[9] || (checksum === 10 && digits[9] === 0)
}

// Walidacja REGON - algorytm sumy kontrolnej
const validateRegon = (regon: string): boolean => {
  if (!regon || !/^\d{9}(\d{5})?$/.test(regon)) return false

  const weights9 = [8, 9, 2, 3, 4, 5, 6, 7]
  const weights14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8]

  const digits = regon.split('').map(d => parseInt(d, 10))

  if (regon.length === 9) {
    const sum = weights9.reduce((acc, weight, index) => acc + weight * digits[index], 0)
    const checksum = sum % 11
    return checksum === 10 ? digits[8] === 0 : checksum === digits[8]
  } else {
    const sum = weights14.reduce((acc, weight, index) => acc + weight * digits[index], 0)
    const checksum = sum % 11
    return checksum === 10 ? digits[13] === 0 : checksum === digits[13]
  }
}

// Reguły walidacji
const rules = {
  required: (v: string) => !!v || 'Pole wymagane',
  nip: (v: string) => {
    if (!v) return 'Pole wymagane'
    if (!/^\d{10}$/.test(v)) return 'NIP musi zawierać dokładnie 10 cyfr'
    if (!validateNip(v)) return 'Nieprawidłowy NIP (błędna suma kontrolna)'
    return true
  },
  regon: (v: string) => {
    if (!v) return 'Pole wymagane'
    if (!/^\d{9}(\d{5})?$/.test(v)) return 'REGON musi zawierać 9 lub 14 cyfr'
    if (!validateRegon(v)) return 'Nieprawidłowy REGON (błędna suma kontrolna)'
    return true
  },
  zipcode: (v: string) => /^\d{2}-?\d{3}$/.test(v) || 'Nieprawidłowy format kodu pocztowego (np. 00-000)',
  email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Nieprawidłowy format email',
  phone: (v: string) => !v || /^\+?\d{9,13}$/.test(v) || 'Nieprawidłowy numer telefonu (9-13 cyfr, opcjonalnie +)'
}

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Filtrowanie kontrahentów
const filteredClients = computed(() => {
  let result = clients.value
  if (filterType.value !== null) {
    result = result.filter(c => c.type === filterType.value)
  }
  return result
})

// Formatowanie NIP
const formatNip = (nip: string): string => {
  if (!nip) return ''
  return nip.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1-$2-$3-$4')
}

// Otwórz dialog
const openDialog = (client?: Client) => {
  if (client) {
    editingClient.value = client
    Object.assign(clientForm, {
      name: client.name,
      type: client.type,
      nip: client.nip,
      regon: client.regon,
      bdo: client.bdo || '',
      krs: client.krs || '',
      street: client.street,
      address: client.address,
      zipcode: client.zipcode,
      city: client.city,
      country: client.country,
      registerDate: client.registerDate,
      vat: client.vat,
      email: client.email || '',
      phone: client.phone || ''
    })
  } else {
    editingClient.value = null
    Object.assign(clientForm, defaultForm)
  }
  dialog.value = true
}

// Zamknij dialog
const closeDialog = () => {
  dialog.value = false
  editingClient.value = null
  Object.assign(clientForm, defaultForm)
  form.value?.reset()
}

// Zapisz kontrahenta
const saveClient = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    // TODO: Integracja z API
    if (editingClient.value) {
      // Edycja
      const index = clients.value.findIndex(c => c.id === editingClient.value!.id)
      if (index !== -1) {
        clients.value[index] = {
          ...clients.value[index],
          name: clientForm.name,
          type: clientForm.type,
          nip: clientForm.nip,
          regon: clientForm.regon,
          bdo: clientForm.bdo || undefined,
          krs: clientForm.krs || undefined,
          street: clientForm.street,
          address: clientForm.address,
          zipcode: clientForm.zipcode,
          city: clientForm.city,
          country: clientForm.country,
          registerDate: clientForm.registerDate,
          vat: clientForm.vat,
          email: clientForm.email || null,
          phone: clientForm.phone || null,
          updated_at: new Date().toISOString()
        }
      }
      showSnackbar('Kontrahent został zaktualizowany', 'success')
    } else {
      // Dodawanie
      const newClient: Client = {
        id: crypto.randomUUID(),
        name: clientForm.name,
        type: clientForm.type,
        nip: clientForm.nip,
        regon: clientForm.regon,
        bdo: clientForm.bdo || undefined,
        krs: clientForm.krs || undefined,
        street: clientForm.street,
        address: clientForm.address,
        zipcode: clientForm.zipcode,
        city: clientForm.city,
        country: clientForm.country,
        registerDate: clientForm.registerDate,
        vat: clientForm.vat,
        email: clientForm.email || null,
        phone: clientForm.phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      clients.value.push(newClient)
      showSnackbar('Kontrahent został dodany', 'success')
    }
    closeDialog()
  } catch (error) {
    showSnackbar('Wystąpił błąd podczas zapisywania', 'error')
  } finally {
    saving.value = false
  }
}

// Potwierdź usunięcie
const confirmDelete = (client: Client) => {
  clientToDelete.value = client
  deleteDialog.value = true
}

// Usuń kontrahenta
const deleteClient = async () => {
  if (!clientToDelete.value) return

  deleting.value = true
  try {
    // TODO: Integracja z API
    clients.value = clients.value.filter(c => c.id !== clientToDelete.value!.id)
    showSnackbar('Kontrahent został usunięty', 'success')
    deleteDialog.value = false
    clientToDelete.value = null
  } catch (error) {
    showSnackbar('Wystąpił błąd podczas usuwania', 'error')
  } finally {
    deleting.value = false
  }
}

// Pokaż snackbar
const showSnackbar = (message: string, color: string) => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}
</style>
