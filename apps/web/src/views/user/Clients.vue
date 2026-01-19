<template>
    <v-container fluid>
        <v-row class="mb-4">
            <v-col>
                <h1 class="text-h4">Kontrahenci</h1>
                <p class="text-subtitle-1 text-grey">Zarządzaj listą kontrahentów</p>
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
            <v-col cols="auto" class="d-flex align-center">
                <v-btn color="#d63031" prepend-icon="mdi:mdi-plus" class="mr-2" @click="createDialog = true">
                    Dodaj kontrahenta
                </v-btn>

                <v-btn
                    color="error"
                    variant="outlined"
                    :disabled="selected.length === 0"
                    @click="confirmDelete(selected)"
                >
                    Usuń zaznaczone
                </v-btn>
            </v-col>
        </v-row>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="filteredContractors"
                :search="search"
                :loading="loading"
                show-select
                return-object
                item-value="id"
                v-model="selected"
                hover
                class="elevation-1"
            >
                <template #header.data-table-select="{ allSelected, someSelected, selectAll }">
                    <v-checkbox-btn
                        :model-value="allSelected"
                        :indeterminate="someSelected && !allSelected"
                        @update:model-value="selectAll"
                        color="primary"
                        true-icon="mdi:mdi-checkbox-marked"
                        false-icon="mdi:mdi-checkbox-blank-outline"
                        indeterminate-icon="mdi:mdi-minus-box"
                    />
                </template>

                <template #item.data-table-select="{ internalItem, isSelected, toggleSelect }">
                    <v-checkbox-btn
                        :model-value="isSelected(internalItem)"
                        @update:model-value="() => toggleSelect(internalItem)"
                        color="primary"
                        true-icon="mdi:mdi-checkbox-marked"
                        false-icon="mdi:mdi-checkbox-blank-outline"
                        indeterminate-icon="mdi:mdi-minus-box"
                    />
                </template>
                <!-- Template do customowego formatowania komórek działa razem z #items i #no-data to jest poprawnie -->

                <template #item.actions="{ item }">
                    <v-btn size="small" variant="text" @click="openDetails(item)">
                        <v-icon>mdi:mdi-eye</v-icon>
                    </v-btn>
                    <v-btn size="small" variant="text" @click="confirmDelete([item])">
                        <v-icon>mdi:mdi-delete</v-icon>
                    </v-btn>
                </template>

                <template #no-data>
                    <v-alert type="info" variant="tonal" class="ma-4">
                        Brak kontrahentów do wyświetlenia. Dodaj pierwszy wpis!
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="detailsDialog" max-width="900">
            <ContractorDetails
                :contractor="selectedContractor"
                :saving="updating"
                :deleting="deleting"
                @close="closeDetails"
                @update="updateContractor"
                @delete="confirmDelete([$event])"
            />
        </v-dialog>

        <v-dialog v-model="createDialog" max-width="900">
            <ContractorCreate ref="createRef" :loading="creating" @create="createContractor" />
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="420">
            <v-card>
                <v-card-title class="text-h6">Potwierdź usunięcie</v-card-title>
                <v-card-text>
                    Czy na pewno chcesz usunąć {{ deleteTargets.length }} element(ów)? Ta operacja jest nieodwracalna.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="deleteDialog = false">Anuluj</v-btn>
                    <v-btn color="error" :loading="deleting" @click="deleteContractors">Usuń</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import { client, getAuthHeaders, type IContractor } from "../../api";
import ContractorCreate from "../../components/contractors/ContractorCreate.vue";
import ContractorDetails from "../../components/contractors/ContractorDetails.vue";

const loading = ref(false);
const creating = ref(false);
const updating = ref(false);
const deleting = ref(false);
const search = ref("");
const detailsDialog = ref(false);
const createDialog = ref(false);
const deleteDialog = ref(false);
const createRef = ref<InstanceType<typeof ContractorCreate> | null>(null);

const contractors = ref<IContractor[]>([]);
const selected = ref<IContractor[]>([]);
const selectedContractor = ref<IContractor | null>(null);
const deleteTargets = ref<IContractor[]>([]);

const headers = [
    { title: "Nazwa", key: "own_name", sortable: true },
    { title: "NIP", key: "nip", sortable: true },
    { title: "Ulica", key: "street", sortable: true },
    { title: "Adres", key: "address", sortable: true },
    { title: "Kod pocztowy", key: "zipcode", sortable: true },
    { title: "Miasto", key: "city", sortable: true },
    { title: "Kraj", key: "country", sortable: true },
    { title: "Akcje", key: "actions", sortable: false, align: "center" as const },
];

const snackbar = reactive({
    show: false,
    message: "",
    color: "success",
});

const fetchContractors = async () => {
    loading.value = true;
    try {
        const response = await client.contractorsList({
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            contractors.value = response.body;
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas pobierania danych", "error");
    } finally {
        loading.value = false;
    }
};

const filteredContractors = computed(() => contractors.value);

const createContractor = async (payload: Parameters<typeof client.contractorsCreate>[0]["body"]) => {
    creating.value = true;
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            showSnackbar("Brak tokenu autoryzacji. Zaloguj się ponownie.", "error");
            return;
        }
        const response = await client.contractorsCreate({
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showSnackbar("Produkt/usługa została dodana", "success");
            await fetchContractors();
            createRef.value?.reset();
            createDialog.value = false;
        } else if (response.status === 400) {
            const body = response.body as { message?: string };
            showSnackbar(body.message || "Nieprawidłowe dane", "error");
        } else if (response.status === 401 || response.status === 403) {
            showSnackbar("Brak uprawnień. Zaloguj się ponownie.", "error");
        } else {
            showSnackbar("Nie udało się dodać produktu/usługi", "error");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas dodawania", "error");
    } finally {
        creating.value = false;
    }
};

const openDetails = (contractor: IContractor) => {
    selectedContractor.value = contractor;
    detailsDialog.value = true;
};

const closeDetails = () => {
    detailsDialog.value = false;
    selectedContractor.value = null;
};

const updateContractor = async (payload: Parameters<typeof client.contractorsUpdate>[0]["body"]) => {
    if (!selectedContractor.value) return;
    updating.value = true;
    try {
        const response = await client.contractorsUpdate({
            params: { id: selectedContractor.value.id },
            body: payload,
            headers: getAuthHeaders(),
        });
        if (response.status === 200) {
            showSnackbar("Produkt/usługa została zaktualizowana", "success");
            await fetchContractors();
            closeDetails();
        } else if (response.status === 404) {
            showSnackbar("Nie znaleziono wpisu", "error");
        }
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas zapisywania", "error");
    } finally {
        updating.value = false;
    }
};

const confirmDelete = (targets: IContractor[]) => {
    deleteTargets.value = targets;
    deleteDialog.value = true;
};

const deleteContractors = async () => {
    if (!deleteTargets.value.length) return;
    deleting.value = true;
    try {
        await Promise.all(
            deleteTargets.value.map((contractor) =>
                client.contractorsDelete({
                    params: { id: contractor.id },
                    headers: getAuthHeaders(),
                })
            )
        );
        showSnackbar("Usunięto wybrane elementy", "success");
        await fetchContractors();
        selected.value = [];
        if (selectedContractor.value && deleteTargets.value.some((c) => c.id === selectedContractor.value!.id)) {
            closeDetails();
        }
        deleteDialog.value = false;
        deleteTargets.value = [];
    } catch (error) {
        showSnackbar("Wystąpił błąd podczas usuwania", "error");
    } finally {
        deleting.value = false;
    }
};

const showSnackbar = (message: string, color: string) => {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.show = true;
};

onMounted(() => {
    fetchContractors();
});
</script>
