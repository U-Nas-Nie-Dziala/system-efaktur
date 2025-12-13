// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT

import {
    Faktura,
    Naglowek,
    Podmiot1,
    DaneIdentyfikacyjne,
    NIP,
    Nazwa,
    Adres,
    AdresKoresp,
    AdresL1,
    AdresL2,
    Podmiot2,
    DaneIdentyfikacyjne2,
} from "../xml/data";

export type FakturaParams = ConstructorParameters<typeof Faktura>;
export type NaglowekParams = ConstructorParameters<typeof Naglowek>;
export type Podmiot1Params = ConstructorParameters<typeof Podmiot1>;
export type Podmiot2Params = ConstructorParameters<typeof Podmiot2>;
export type DaneIdentyfikacyjneParams = ConstructorParameters<typeof DaneIdentyfikacyjne>;
export type DaneIdentyfikacyjne2Params = ConstructorParameters<typeof DaneIdentyfikacyjne2>;
export type NipParams = ConstructorParameters<typeof NIP>;
export type NazwaParams = ConstructorParameters<typeof Nazwa>;
export type AdresParams = ConstructorParameters<typeof Adres>;
export type AdresKorespParams = ConstructorParameters<typeof AdresKoresp>;
export type AdresL1Params = ConstructorParameters<typeof AdresL1>;
export type AdresL2Params = ConstructorParameters<typeof AdresL2>;
// export type
