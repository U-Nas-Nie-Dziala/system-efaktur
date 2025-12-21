<script setup lang="ts">
import { reactive, ref } from "vue";

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
};

const companyState = reactive<{
  name: string;
  select: typeof CompanyType | null;
  nip: string;
  regon: string;
  bdo: string;
  krs: string;
  street: string;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  registerDate: Date | null;
  vat: boolean;
}>({
  name: "",
  select: null,
  nip: "",
  regon: "",
  bdo: "",
  krs: "",
  street: "",
  address: "",
  zipcode: "",
  city: "",
  country: "",
  registerDate: null,
  vat: false,
});

const show = ref(false);
const loading = ref(false);

const submit = (e: Event) => {
  e.preventDefault();
  loading.value = true;
  console.log(
    "Company data changed:",
    companyState.name,
    companyState.select,
    companyState.nip
  );
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>

<template>
  <v-row dense justify="center" class="mt-6">
    <v-col cols="12" md="8">
      <v-card elevation="2" :disabled="loading">
        <v-card-title
          class="d-flex align-center justify-space-between pa-4"
          style="
            background: linear-gradient(
              to left,
              #ffb3b3,
              #ff8a8a,
              #ff6b6b,
              #ee5a6f
            );
            cursor: pointer;
          "
          @click="show = !show"
        >
          <div>
            <v-icon class="mr-2">mdi:mdi-domain</v-icon>
            Ustawienia danych firmy
          </div>
          <v-icon :icon="show ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'">
          </v-icon>
        </v-card-title>

        <v-divider></v-divider>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-form @submit="submit"
              ><v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="companyState.name"
                      :counter="10"
                      label="Nazwa firmy"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="companyState.nip"
                      label="NIP"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="companyState.select"
                      :items="
                        Object.entries(CompanyType).map(([value, title]) => ({
                          value,
                          title,
                        }))
                      "
                      label="Forma prwana"
                      variant="outlined"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="companyState.regon"
                      :counter="10"
                      label="REGON"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="companyState.krs"
                      :counter="10"
                      label="KRS"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="companyState.bdo"
                      :counter="10"
                      label="BDO"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.city"
                      :counter="10"
                      label="Miasto"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.street"
                      :counter="10"
                      label="Ulica"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.address"
                      :counter="10"
                      label="Numer domu/lokalu"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.zipcode"
                      :counter="10"
                      label="Kod pocztowy"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.country"
                      :counter="10"
                      label="Kraj"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="companyState.registerDate"
                      label="Data rejestracji"
                      type="date"
                      variant="outlined"
                      required
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-checkbox-btn
                      v-model="companyState.vat"
                      label="Czy podmiot jest czynnym podatnikiem VAT?"
                      variant="outlined"
                      value="true"
                      :true-value="true"
                      :false-value="false"
                      required
                    ></v-checkbox-btn>
                  </v-col>
                </v-row>
              </v-container>
              <div class="d-flex justify-center pb-4">
                <v-btn
                  type="submit"
                  color="#ff6b6b"
                  variant="outlined"
                  :loading="loading"
                  >Zapisz zmiany</v-btn
                >
              </div></v-form
            >
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
</template>
