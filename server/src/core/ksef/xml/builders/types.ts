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
    Nazwa,
    NIP,
    OpisRoli,
    Rola,
    RolaInna,
    RolaPU,
    Telefon,
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
