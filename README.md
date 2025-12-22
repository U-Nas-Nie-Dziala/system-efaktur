# 🧾 System e-Faktur

Projekt zespołowy mający na celu stworzenie aplikacji do obsługi **faktur elektronicznych**.

---

## 👥 Skład zespołu

-   **Roszkowski Daniel**
-   **Pijagin Ludwika**
-   **Jaworowski Bartłomiej**
-   **Pogorzelski Kamil**
-   **Kozikowski Radosław**

---

## Uruchomienie aplikacji

1. W głównym katalogu projektu należy wykonać wszystkie poniższe komendy.

```bash
npm install
```

2. Następnie w katalogu `apps/api` utworzyć plik `.env` na bazie pliku `.env.example`.

2.1. Pola oznaczone `DB_*` należy uzupełnić danymi dostępowymi do serwera baz danych MySQL/MariaDB.

2.2. Pole `SCS_KSEF_API=` należy uzupełnić kluczem dostępowym do usługi SCS, który można uzyskać od @venoxdevpl. Klucz jest wymagany do poprawnego generowania plików XML na bazie pliku logicznego FA(3).

2.3. Uruchomienie aplikacji klienta: `npm run dev:web`.

2.4. Uruchomienie aplikacji serwera: `npm run dev:api`.

## Instalowanie dodatkowych zależności

W głównym katalogu projektu należy wykonać polecenie: `npm i <pakiet> -w <workspace>`. Gdzie `<pakiet>` to nazwa pakietu a `<workspace>` przyjmuje wartości: `apps/api`, `apps/web` lub `packages/<paczka>`. `<paczka>` przyjmuje wartości zgodne z strukturą katalogów np. `contract`.

Przykład: `npm i express -w apps/api`, `npm i vue -w apps/web` lub `npm i @ts-rest/core -w packages/contract`.

#### UWAGA!

**Nie powinno instalować się zależności inaczej niż zgodnie z instrukcją.**

`npm i <pakiet>` - spowoduje zainstalowanie wybranego pakietu globalnie w wszystkich workspace'ach.

## Specyfikacja techniczna

1. Zaleca się korzystać z menadżera wersji pakietu Node & NPM - [Volta](https://volta.sh), który zintegrowany jest z projektem.
2. W Krajowym Systemie e-Faktur należy posługiwać się **zanonimizowanymi**, **fikcyjnymi** danymi.
