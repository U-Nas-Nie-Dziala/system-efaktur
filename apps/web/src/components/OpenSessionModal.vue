<template>
    <v-dialog v-model="$dialog" persistent max-width="480px">
        <template v-slot:activator="{ props }">
            <v-list-item prepend-icon="mdi:mdi-open-in-app" title="Otwórz sesję" v-bind="props" />
        </template>
        <v-card>
            <v-card-title>Otwieranie sesji KSeF</v-card-title>
            <v-form @submit.prevent="openKsef">
                <v-card-text>
                    <v-text-field
                        v-model="$form.input.password"
                        type="password"
                        variant="outlined"
                        label="Hasło tokenu KSeF"
                        hint="Wprowadź hasło ustawione razem z tokenem KSeF w ustawieniach aplikacji."
                        @update:model-value="clearErrors"
                        :error="$form.errors.password.length > 0"
                        :error-messages="$form.errors.password"
                    />
                </v-card-text>

                <v-card-actions class="d-flex flex-row justify-space-between">
                    <v-btn text="Anuluj" color="dark" variant="tonal" @click="close" />
                    <v-btn type="submit" text="Otwórz sesję" color="error" variant="tonal" />
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { contract } from "@repo/contract";
import { ref } from "vue";
import { ZodError } from "zod";
import { client, getAuthHeaders } from "../api";
import { useToast } from "vue-toastification";

const $toast = useToast();

const $form = ref<{
    input: {
        password: string;
    };
    errors: {
        password: string[];
    };
}>({
    input: {
        password: "",
    },
    errors: {
        password: [],
    },
});

const clearErrors = () => {
    $form.value.errors.password = [];
};

const openKsef = async () => {
    try {
        const data = await contract.ksefOpenSession.body.parseAsync($form.value.input);

        const response = await client.ksefOpenSession({
            body: data,
            headers: getAuthHeaders(),
        });

        if (response.status == 200) {
            $toast.success(response.body.message);
            $dialog.value = false;
            $form.value.input.password = "";
        } else if (response.status == 400) {
            $toast.error(response.body.message);
        } else if (response.status == 403) {
            $toast.error(response.body.message);
        } else if (response.status == 404) {
            $toast.error(response.body.message);
        } else if (response.status == 409) {
            $toast.error(response.body.message);
        } else if (response.status == 500) {
            $toast.error(response.body.message);
        } else {
            $toast.error("Wystąpił błąd.");
        }
    } catch (e) {
        const err = e as unknown;

        if (err instanceof ZodError) {
            err.issues.forEach((v) => {
                if (v.path.join(".") === "password") {
                    $form.value.errors.password.push(v.message);
                }
            });
            return;
        }
    }
};

const close = () => {
    $dialog.value = false;
};

const $dialog = ref<boolean>(false);
</script>
