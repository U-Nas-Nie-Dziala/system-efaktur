<script setup>
import { ref } from "vue";
import { reactive } from "vue";

const username = ref("jan.kowalski");
const email = ref("jan.kowalski@example.com");
const password = ref("");
const recentInvoices = ref([]);
const show1 = ref(false);
const show2 = ref(false);
const show3 = ref(false);

const initialState = {
  name: "",
  email: "",
  select: null,
  checkbox: null,
};

const state = reactive({
  ...initialState,
});

const items = ["Item 1", "Item 2", "Item 3", "Item 4"];
</script>

<template>
  <v-container fluid class="align-self-start py-6 px-4">
    <div class="d-flex flex-column align-center text-center">
      <div>
        <h1>Ustawienia</h1>
        <p>Tu możesz zmienić swoje ustawienia konta.</p>
      </div>
    </div>

    <v-row dense justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="
              background: linear-gradient(
                to left,
                #ffb3b3,
                #ff8a8a,
                #ff6b6b,
                #ee5a6f
              );
            "
          >
            <div>
              <v-icon class="mr-2">mdi:mdi-account</v-icon>
              Ustawienia użytkownika
            </div>
            <v-btn
              :icon="show1 ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"
              @click="show1 = !show1"
            >
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-expand-transition>
            <div v-show="show1">
              <v-divider></v-divider>

              <!-- Zmiana danych użytkownika -->
              <v-form @submit="submit1"
                ><v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="firstname"
                        :counter="10"
                        :rules="nameRules"
                        label="First name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="lastname"
                        :counter="10"
                        :rules="nameRules"
                        label="Last name"
                        required
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <!-- Zmiana email -->

              <v-form @submit="submit1"
                ><v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="firstname"
                        :counter="10"
                        :rules="nameRules"
                        label="First name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="lastname"
                        :counter="10"
                        :rules="nameRules"
                        label="Last name"
                        required
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

              <!-- Zmiana hasła -->
              <v-divider></v-divider>
              <v-form>
                <v-text-field
                  v-model="state.name"
                  :counter="10"
                  label="Name"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="state.email"
                  label="E-mail"
                  required
                ></v-text-field>

                <v-select
                  v-model="state.select"
                  :items="items"
                  label="Item"
                  required
                ></v-select>

                <v-checkbox
                  v-model="state.checkbox"
                  label="Do you agree?"
                  required
                ></v-checkbox>

                <v-btn class="me-4"> submit </v-btn>
              </v-form>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="
              background: linear-gradient(
                to left,
                #ffb3b3,
                #ff8a8a,
                #ff6b6b,
                #ee5a6f
              );
            "
          >
            <div>
              <v-icon class="mr-2">mdi:mdi-domain</v-icon>
              Ustawienia danych firmy
            </div>
            <v-btn
              :icon="show2 ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"
              @click="show2 = !show2"
            >
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-expand-transition>
            <div v-show="show2">
              <v-divider></v-divider>

              <v-form @submit="submit2"
                ><v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="firstname"
                        :counter="10"
                        :rules="nameRules"
                        label="First name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="lastname"
                        :counter="10"
                        :rules="nameRules"
                        label="Last name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row> </v-container
              ></v-form>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="
              background: linear-gradient(
                to left,
                #ffb3b3,
                #ff8a8a,
                #ff6b6b,
                #ee5a6f
              );
            "
          >
            <div>
              <v-icon class="mr-2">mdi:mdi-file-document-multiple</v-icon>
              Ustawienia połączenia z KSeF
            </div>
            <v-btn
              :icon="show3 ? 'mdi:mdi-chevron-up' : 'mdi:mdi-chevron-down'"
              @click="show3 = !show3"
            >
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-expand-transition>
            <div v-show="show3">
              <v-divider></v-divider>

              <v-form @submit="submit3">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="firstname"
                        :counter="10"
                        :rules="nameRules"
                        label="First name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="lastname"
                        :counter="10"
                        :rules="nameRules"
                        label="Last name"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
