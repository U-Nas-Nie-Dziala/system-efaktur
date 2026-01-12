<template>
    <v-footer class="d-flex align-center ga-2 py-3 flex-grow-1 flex-wrap justify-center" elevation="8">
        <v-container>
            <v-sheet>
                <v-row>
                    <v-col cols="12" md="4">
                        <h3 class="font-weight-bold mb-3">System E-faktur</h3>
                        <p class="text-body-2">Innowacyjne rozwiązanie do zarządzania fakturami i zadaniami.</p>
                    </v-col>
                    <v-col cols="12" md="4">
                        <h4 class="font-weight-bold mb-3">Szybkie linki</h4>
                        <div class="d-flex flex-column">
                            <RouterLink to="/" class="text-body-2 mb-1 text-decoration-none">
                                Strona główna
                            </RouterLink>
                            <RouterLink to="/about" class="text-body-2 mb-1 text-decoration-none"> O nas </RouterLink>
                            <RouterLink to="/contact" class="text-body-2 text-decoration-none"> Kontakt </RouterLink>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <h4 class="font-weight-bold mb-3">Kontakt</h4>
                        <p class="text-body-2 mb-1">
                            <v-icon size="small" class="mr-2">fa-solid fa-envelope</v-icon>
                            kontakt@behapp.pl
                        </p>
                        <p class="text-body-2">
                            <v-icon size="small" class="mr-2">fa-solid fa-phone</v-icon>
                            +48 123 456 789
                        </p>
                    </v-col>
                </v-row>
                <v-divider class="my-4 bg-grey"></v-divider>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <p class="text-body-2 mb-0">© 2024 Beh App. Wszelkie prawa zastrzeżone.</p>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-container>
    </v-footer>
</template>
