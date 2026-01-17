import "reflect-metadata";
import { XmlArray, XmlChoiceGroup, XmlElement } from "../decorators";
import {
    TEmail,
    TNIP,
    TNIPIdWew,
    TNrRB,
    TNrVatUE,
    TProcentowy,
    TSWIFT,
    TTelefon,
    TZnakowy,
    TZnakowy50,
    TZnakowy512,
} from "./simple-types";
import {
    TKodyKrajowUE,
    TRachunekWlasnyBanku,
    TRolaPodmiotu3,
    TRolaPodmiotuUpowaznionego,
    TStatusInfoPodatnika,
} from "./enums";
import { TAdres } from "./address";

export class DaneIdentyfikacyjnePodatnika {
    @XmlElement({ name: "NIP", order: 1, required: true })
    nip: TNIP;

    @XmlElement({ name: "Nazwa", order: 2, required: true })
    nazwa: TZnakowy512;
}

/**
 * Choice: NIP / (KodUE+NrVatUE) / (KodKraju+NrID) / BrakID
 */
@XmlChoiceGroup({
    name: "identyfikator",
    required: false,
    options: [["nip"], ["kodUE", "nrVatUE"], ["kodKraju", "nrID"], ["brakID"]],
})
export class DaneIdentyfikacyjneNabywcy {
    @XmlElement({ name: "NIP", order: 1 })
    nip?: TNIP;

    // Kod (prefiks) kraju VAT UE
    @XmlElement({ name: "KodUE", order: 2 })
    kodUE?: TKodyKrajowUE;

    @XmlElement({ name: "NrVatUE", order: 3 })
    nrVatUE?: TNrVatUE;

    @XmlElement({ name: "KodKraju", order: 4 })
    kodKraju?: TKodyKrajowUE | string;

    @XmlElement({ name: "NrID", order: 5 })
    nrID?: string;

    @XmlElement({ name: "BrakID", order: 6 })
    brakID?: 1;

    @XmlElement({ name: "Nazwa", order: 7 })
    nazwa?: TZnakowy512;
}

/**
 * Choice: NIP / IDWew / (KodUE+NrVatUE) / (KodKraju+NrID) / BrakID
 */
@XmlChoiceGroup({
    name: "identyfikator",
    required: false,
    options: [["nip"], ["idWew"], ["kodUE", "nrVatUE"], ["kodKraju", "nrID"], ["brakID"]],
})
export class DaneIdentyfikacyjnePodmiotu3 {
    @XmlElement({ name: "NIP", order: 1 })
    nip?: TNIP;

    @XmlElement({ name: "IDWew", order: 2 })
    idWew?: TNIPIdWew;

    @XmlElement({ name: "KodUE", order: 3 })
    kodUE?: TKodyKrajowUE;

    @XmlElement({ name: "NrVatUE", order: 4 })
    nrVatUE?: TNrVatUE;

    @XmlElement({ name: "KodKraju", order: 5 })
    kodKraju?: TKodyKrajowUE | string;

    @XmlElement({ name: "NrID", order: 6 })
    nrID?: string;

    @XmlElement({ name: "BrakID", order: 7 })
    brakID?: 1;

    @XmlElement({ name: "Nazwa", order: 8 })
    nazwa?: TZnakowy512;
}

export class DaneKontaktowe {
    @XmlElement({ name: "Email", order: 1 })
    email?: TEmail;

    @XmlElement({ name: "Telefon", order: 2 })
    telefon?: TTelefon;
}

export class DaneKontaktowePU {
    @XmlElement({ name: "EmailPU", order: 1 })
    emailPU?: TEmail;

    @XmlElement({ name: "TelefonPU", order: 2 })
    telefonPU?: TTelefon;
}

export class RachunekBankowy {
    @XmlElement({ name: "NrRB", order: 1, required: true })
    nrRB!: TNrRB;

    @XmlElement({ name: "SWIFT", order: 2 })
    swift?: TSWIFT;

    @XmlElement({ name: "RachunekWlasnyBanku", order: 3 })
    rachunekWlasnyBanku?: TRachunekWlasnyBanku;

    @XmlElement({ name: "NazwaBanku", order: 4 })
    nazwaBanku?: TZnakowy;

    @XmlElement({ name: "OpisRachunku", order: 5 })
    opisRachunku?: TZnakowy;
}

/**
 * Podmiot 1 - Sprzedawca
 */
export class Podmiot1 {
    @XmlElement({ name: "PrefiksPodatnika", order: 1 })
    prefiksPodatnika?: TKodyKrajowUE;

    @XmlElement({ name: "NrEORI", order: 2 })
    nrEORI?: TZnakowy;

    @XmlElement({ name: "DaneIdentyfikacyjne", order: 3, required: true })
    daneIdentyfikacyjne!: DaneIdentyfikacyjnePodatnika;

    @XmlElement({ name: "Adres", order: 4, required: true })
    adres: TAdres;

    @XmlElement({ name: "AdresKoresp", order: 5 })
    adresKoresp?: TAdres;

    @XmlArray({ name: "DaneKontaktowe", itemType: () => DaneKontaktowe, order: 6 })
    daneKontaktowe?: DaneKontaktowe[];

    @XmlElement({ name: "StatusInfoPodatnika", order: 7 })
    statusInfoPodatnika?: TStatusInfoPodatnika;
}

/**
 * Podmiot 2 - Nabywca
 */
export class Podmiot2 {
    @XmlElement({ name: "NrEORI", order: 1 })
    nrEORI?: TZnakowy;

    @XmlElement({ name: "DaneIdentyfikacyjne", order: 2, required: true })
    daneIdentyfikacyjne: DaneIdentyfikacyjneNabywcy;

    @XmlElement({ name: "Adres", order: 3 })
    adres?: TAdres;

    @XmlElement({ name: "AdresKoresp", order: 4 })
    adresKoresp?: TAdres;

    @XmlArray({ name: "DaneKontaktowe", itemType: () => DaneKontaktowe, order: 5 })
    daneKontaktowe?: DaneKontaktowe[];

    @XmlElement({ name: "NrKlienta", order: 6 })
    nrKlienta?: TZnakowy;

    @XmlElement({ name: "IDNabywcy", order: 7 })
    idNabywcy?: TZnakowy50;

    // Znacznik jednostki podrzędnej JST: 1=Tak, 2=Nie (WYMAGANE)
    @XmlElement({ name: "JST", order: 8, required: true })
    jst: 1 | 2;

    // Znacznik członka grupy VAT: 1=Tak, 2=Nie (WYMAGANE)
    @XmlElement({ name: "GV", order: 9, required: true })
    gv: 1 | 2;
}

/**
 * Podmiot 3 - dodatkowy podmiot
 */
@XmlChoiceGroup({
    name: "rola",
    required: true,
    options: [["rola"], ["rolaInna", "opisRoli"]],
})
export class Podmiot3 {
    @XmlElement({ name: "IDNabywcy", order: 1 })
    idNabywcy?: TZnakowy50;

    @XmlElement({ name: "NrEORI", order: 2 })
    nrEORI?: TZnakowy;

    @XmlElement({ name: "DaneIdentyfikacyjne", order: 3, required: true })
    daneIdentyfikacyjne!: DaneIdentyfikacyjnePodmiotu3;

    @XmlElement({ name: "Adres", order: 4 })
    adres?: TAdres;

    @XmlElement({ name: "AdresKoresp", order: 5 })
    adresKoresp?: TAdres;

    @XmlArray({ name: "DaneKontaktowe", itemType: () => DaneKontaktowe, order: 6 })
    daneKontaktowe?: DaneKontaktowe[];

    // Choice: Rola lub (RolaInna+OpisRoli)
    @XmlElement({ name: "Rola", order: 7 })
    rola?: TRolaPodmiotu3;

    @XmlElement({ name: "RolaInna", order: 8 })
    rolaInna?: 1;

    @XmlElement({ name: "OpisRoli", order: 9 })
    opisRoli?: TZnakowy;

    @XmlElement({ name: "Udzial", order: 10 })
    udzial?: TProcentowy;

    @XmlElement({ name: "NrKlienta", order: 11 })
    nrKlienta?: TZnakowy;
}

export class PodmiotUpowazniony {
    @XmlElement({ name: "NrEORI", order: 1 })
    nrEORI?: TZnakowy;

    @XmlElement({ name: "DaneIdentyfikacyjne", order: 2, required: true })
    daneIdentyfikacyjne: DaneIdentyfikacyjnePodatnika;

    @XmlElement({ name: "Adres", order: 3, required: true })
    adres: TAdres;

    @XmlElement({ name: "AdresKoresp", order: 4 })
    adresKoresp?: TAdres;

    @XmlArray({ name: "DaneKontaktowe", itemType: () => DaneKontaktowePU, order: 5 })
    daneKontaktowe?: DaneKontaktowePU[];

    @XmlElement({ name: "RolaPU", order: 6, required: true })
    rolaPU: TRolaPodmiotuUpowaznionego;
}

/**
 * Dane sprzedawcy do korekty
 */
export class Podmiot1K {
    @XmlElement({ name: "PrefiksPodatnika", order: 1 })
    prefiksPodatnika?: TKodyKrajowUE;

    @XmlElement({ name: "DaneIdentyfikacyjne", order: 2, required: true })
    daneIdentyfikacyjne: DaneIdentyfikacyjnePodatnika;

    @XmlElement({ name: "Adres", order: 3, required: true })
    adres: TAdres;
}

/**
 * Dane nabywcy do korekty
 */
export class Podmiot2K {
    @XmlElement({ name: "DaneIdentyfikacyjne", order: 1, required: true })
    daneIdentyfikacyjne: DaneIdentyfikacyjneNabywcy;

    @XmlElement({ name: "Adres", order: 2 })
    adres?: TAdres;

    @XmlElement({ name: "IDNabywcy", order: 3 })
    idNabywcy?: TZnakowy50;
}
