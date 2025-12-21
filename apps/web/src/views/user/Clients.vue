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
      <v-col cols="12" md="2">
        <v-select
          v-model="filterType"
          :items="clientTypes"
          label="Typ"
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
        <template #item.isCompany="{ item }">
          <v-chip :color="item.isCompany ? 'primary' : 'secondary'" size="small">
            {{ item.isCompany ? 'Firma' : 'Osoba fizyczna' }}
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
              <!-- Typ kontrahenta -->
              <v-col cols="12">
                <v-switch
                  v-model="clientForm.isCompany"
                  :label="clientForm.isCompany ? 'Firma' : 'Osoba fizyczna'"
                  color="primary"
                  hide-details
                />
              </v-col>

              <!-- Nazwa -->
              <v-col cols="12">
                <v-text-field
                  v-model="clientForm.name"
                  :label="clientForm.isCompany ? 'Nazwa firmy' : 'Imię i nazwisko'"
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

// Interfejs kontrahenta
interface Client {
  id: string
  name: string
  nip: string
  regon: string
  street: string
  address: string
  zipcode: string
  city: string
  country: string
  email: string | null
  phone: string | null
  isCompany: boolean
  created_at: string
  updated_at: string
}

// Stan komponentu
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const filterType = ref<boolean | null>(null)
const dialog = ref(false)
const deleteDialog = ref(false)
const formValid = ref(false)
const form = ref<VForm | null>(null)

const editingClient = ref<Client | null>(null)
const clientToDelete = ref<Client | null>(null)

// Przykładowe dane
const clients = ref<Client[]>([
  {
    id: '1',
    name: 'ABC Sp. z o.o.',
    nip: '1234567890',
    regon: '12345678901234',
    street: 'ul. Przykładowa',
    address: '10/2',
    zipcode: '00-001',
    city: 'Warszawa',
    country: 'Polska',
    email: 'kontakt@abc.pl',
    phone: '48123456789',
    isCompany: true,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jan Kowalski',
    nip: '9876543210',
    regon: '98765432109876',
    street: 'ul. Testowa',
    address: '5',
    zipcode: '30-001',
    city: 'Kraków',
    country: 'Polska',
    email: 'jan.kowalski@email.com',
    phone: null,
    isCompany: false,
    created_at: '2024-02-20',
    updated_at: '2024-02-20'
  }
])

// Typy kontrahentów do filtrowania
const clientTypes = [
  { title: 'Firma', value: true },
  { title: 'Osoba fizyczna', value: false }
]

// Nagłówki tabeli
const headers = [
  { title: 'Nazwa', key: 'name', sortable: true },
  { title: 'Typ', key: 'isCompany', sortable: true },
  { title: 'NIP', key: 'nip', sortable: true },
  { title: 'Adres', key: 'address', sortable: false },
  { title: 'Kontakt', key: 'contact', sortable: false },
  { title: 'Akcje', key: 'actions', sortable: false, align: 'center' as const }
]

// Formularz kontrahenta
const defaultForm = {
  name: '',
  nip: '',
  regon: '',
  street: '',
  address: '',
  zipcode: '',
  city: '',
  country: 'Polska',
  email: '',
  phone: '',
  isCompany: true
}

const clientForm = reactive({ ...defaultForm })

// Reguły walidacji
const rules = {
  required: (v: string) => !!v || 'Pole wymagane',
  nip: (v: string) => /^\d{10}$/.test(v) || 'NIP musi zawierać 10 cyfr',
  regon: (v: string) => /^\d{9}(\d{5})?$/.test(v) || 'REGON musi zawierać 9 lub 14 cyfr',
  zipcode: (v: string) => /^\d{2}-?\d{3}$/.test(v) || 'Nieprawidłowy format kodu pocztowego',
  email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Nieprawidłowy format email',
  phone: (v: string) => !v || /^\+?\d{9,12}$/.test(v) || 'Nieprawidłowy numer telefonu (9-12 cyfr)'
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
    result = result.filter(c => c.isCompany === filterType.value)
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
      nip: client.nip,
      regon: client.regon,
      street: client.street,
      address: client.address,
      zipcode: client.zipcode,
      city: client.city,
      country: client.country,
      email: client.email || '',
      phone: client.phone || '',
      isCompany: client.isCompany
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
          ...clientForm,
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
        ...clientForm,
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
