// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT

import {
    Adres,
    AdresKoresp,
    AdresL1,
    AdresL2,
    DaneIdentyfikacyjne,
    DaneIdentyfikacyjne2,
    DaneKontaktowe,
    DaneKontaktowePU,
    Email,
    GLN,
    GV,
    JST,
    KodFormularza,
    KodKraju,
    KodWaluty,
    KursWalutyZ,
    Nazwa,
    NIP,
    OkresFa,
    OpisRoli,
    Rola,
    RolaInna,
    RolaPU,
    Telefon,
    WZ,
} from "../data";

export type SetNaglowekType = {
    kodFormularza: KodFormularza;
    wariantFormularza: string | "3";
    dataWytworzeniaFa: string;
    systemInfo?: string;
};

export type NewNipType = {
    nip: string;
};

export type NewNazwaType = {
    nazwa: string;
};

export type NewDaneIdentyfikacyjneType = {
    NIP: NIP;
    Nazwa: Nazwa;
};

export type NewAdresType = {
    kodKraju: KodKraju;
    adresL1: AdresL1;
    adresL2?: AdresL2;
    gln?: GLN;
};

export type NewGLNType = {
    gln: string;
};

export type NewKodKrajuType = {
    kod: string;
};

export type NewAdresL1Type = {
    adres: string;
};

export type NewTelefonType = {
    telefon: string;
};

export type NewEmailType = {
    email: string;
};

export type NewAdresL2Type = NewAdresL1Type;
export type NewAdresKorespType = NewAdresType;

export type NewDaneKontaktoweType = {
    email?: Email;
    telefon?: Telefon;
};

export type SetPodmiot1Type = {
    prefiksPodatnika?: string;
    nrEORI?: string;
    daneIdentyfikacyjne: DaneIdentyfikacyjne;
    adres: Adres;
    adresKoresp?: AdresKoresp;
    daneKontaktowe?: DaneKontaktowe;
    statusInfoPodatnika?: 1 | 2 | 3 | 4;
};

export type NewDaneIdentyfikacyjne2Type = {
    nip?: NIP;
    nazwa: Nazwa;
    kodUE?: string;
    nrVatUE?: string;
    kodKraju?: KodKraju;
    nrID?: string;
    brakID?: 1;
};

export type NewJSTType = {
    value: 1 | 2;
};

export type NewGVType = {
    value: 1 | 2;
};

export type SetPodmiot2Type = {
    nrEORI?: string;
    daneIdentyfikacyjne: DaneIdentyfikacyjne2;
    adres: Adres;
    adresKoresp?: AdresKoresp;
    daneKontaktowe?: DaneKontaktowe;
    nrKlienta?: string;
    idNabywcy?: string;
    jst: JST;
    gv: GV;
};

export type NewRolaType = {
    value: 1 | 2 | 3;
};

export type NewRolaInna = {
    value: 1;
};

export type NewOpisRoli = {
    value: string;
};

export type SetPodmiot3Type = {
    idNabywcy?: string;
    nrEORI?: string;
    daneIdentyfikacyjne: DaneIdentyfikacyjne2;
    adres?: Adres;
    adresKoresp?: AdresKoresp;
    daneKontaktowe?: DaneKontaktowe;
    rola?: Rola;
    rolaInna?: RolaInna;
    opisRoli?: OpisRoli;
    udzial?: string;
    nrKlienta?: string;
};

export type NewEmailPuType = {
    Value: string;
};

export type NewTelefonPuType = {
    Value: string;
};

export type NewDaneKontaktowePUType = {
    emailPU?: Email;
    telefonPU?: Telefon;
};

export type NewRolaPuType = {
    Value: 1 | 2 | 3;
};

export type SetPodmiotUpowaznionyType = {
    nrEORI?: string;
    daneIdentyfikacyjne: DaneIdentyfikacyjne;
    adres: Adres;
    adresKoresp?: AdresKoresp;
    daneKontaktowe?: DaneKontaktowePU;
    rolaPU: RolaPU;
};

export type NewKodWaluty = {
    Value: "PLN" | "EUR" | "USD";
};

export type NewDataWystawieniaFaType = {
    Value: string;
};

export type NewMiejsceWystawieniaFaType = {
    Value: string;
};

export type NewNumerFaType = {
    Value: string;
};

export type NewWzFaType = {
    Value: string;
};

export type NewDataWykonaniaFaType = {
    Value: string;
};

export type NewOkresFaType = {
    Od: string;
    Do: string;
};

export type NewPodsumowanieStawekVat23Type = {
    wartoscNetto?: number;
    wartoscVat?: number;
    podatekPrzeliczonyNaPLN?: number;
};

export type NewPodsumowanieStawekVat23DataType = {
    P_13_1?: number;
    P_14_1?: number;
    P_14_1W?: number;
};

export type NewPodsumowanieStawekVat8Type = {
    wartoscNetto?: number;
    wartoscVat?: number;
    podatekPrzeliczonyNaPLN?: number;
};

export type NewPodsumowanieStawekVat8DataType = {
    P_13_2?: number;
    P_14_2?: number;
    P_14_2W?: number;
};

export type NewPodsumowanieStawekVat5Type = {
    wartoscNetto?: number;
    wartoscVat?: number;
    podatekPrzeliczonyNaPLN?: number;
};

export type NewPodsumowanieStawekVat5DataType = {
    P_13_3?: number;
    P_14_3?: number;
    P_14_3W?: number;
};

export type NewPodsumowanieStawekVat4Type = {
    wartoscNetto?: number;
    wartoscVat?: number;
    podatekPrzeliczonyNaPLN?: number;
};

export type NewPodsumowanieStawekVat4DataType = {
    P_13_4?: number;
    P_14_4?: number;
    P_14_4W?: number;
};

export type NewPodsumowanieStawekVatProceduraSzczegolnaType = {
    wartoscNetto?: number;
    wartoscVat?: number;
};

export type NewPodsumowanieStawekVatProceduraSzczegolnaDataType = {
    P_13_5?: number;
    P_14_5?: number;
};

export type NewPodsumowanieStawekVat0Type = {
    sumaWartosci0krajowa?: number;
    sumaWartosci0WDT?: number;
    sumaWartosci0export?: number;
};

export type NewPodsumowanieStawekVat0DataType = {
    P_13_6_1?: number;
    P_13_6_2?: number;
    P_13_6_3?: number;
};

export type NewPodsumowanieStawekVatPozostaleType = {
    sumaWartosciSprzedazyZwolnionej?: number;
    sumaWartosciPozaRP?: number;
    sumaWartosciObjetychWNT?: number;
    sumaWartosciOdwrotneObciazenie?: number;
    sumaWartosciProceduraMarzy?: number;
};

export type NewPodsumowanieStawekVatPozostaleDataType = {
    P_13_7?: number;
    P_13_8?: number;
    P_13_9?: number;
    P_13_10?: number;
    P_13_11?: number;
};

export type NewAdnotacjeFaType = {
    metodaKasowa: 1 | 2;
    samofakturowanie: 1 | 2;
    odwrotneObciazenie: 1 | 2;
    mechanizmPodzielonejPlatnosci: 1 | 2;
    dostawaTowarowUslugZwolnionych: 1 | 2;
};

export type NewZwolnienieFaType = {
    P_19?: 1;
    P_19A?: string;
    P_19B?: string;
    P_19C?: string;
    P_19N?: 1;
};

export type NewPMarzyType = {
    znacznik?: 1;
    P_19A?: string;
    P_19B?: string;
    P_19C?: string;
    P_19N?: 1;
};

export type SetFaType = {
    kodWaluty: KodWaluty;
    dataWystawieniaFa: string;
    miejsceWystawieniaFa?: string;
    numerFa: string;
    wzFa?: WZ[];
    dataWykonaniaFa?: string;
    okresFa?: OkresFa;
    podsumowanieStawekVat23?: NewPodsumowanieStawekVat23DataType;
    podsumowanieStawekVat8?: NewPodsumowanieStawekVat8DataType;
    podsumowanieStawekVat5?: NewPodsumowanieStawekVat5DataType;
    podsumowanieStawekVat4?: NewPodsumowanieStawekVat4DataType;
    podsumowanieStawekVatProceduraSzczegolna?: NewPodsumowanieStawekVatProceduraSzczegolnaDataType;
    podsumowanieStawekVat0?: NewPodsumowanieStawekVat0DataType;
    podsumowanieStawekVatPozostale?: NewPodsumowanieStawekVatPozostaleDataType;
    kwotaNaleznosciOgolem: number;
    kursWalutyZ?: KursWalutyZ;
};
