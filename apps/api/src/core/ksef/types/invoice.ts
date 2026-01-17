import "reflect-metadata";
import { XmlChoiceGroup, XmlElement } from "../decorators";
import { TData, TIlosc, TKwotowy, TNaturalny, TNumerKSeF, TZnakowy } from "./simple-types";

export class OkresFa {
    @XmlElement({ name: "P_6_Od", order: 1, required: true })
    dataOd: TData;

    @XmlElement({ name: "P_6_Do", order: 2, required: true })
    dataDo: TData;
}

/**
 * Dane faktury korygowanej
 */
@XmlChoiceGroup({
    name: "numerKSeF",
    required: true,
    options: [["znacznikKSeF", "numerKSeFFaKorygowanej"], ["znacznikPozaKSeF"]],
})
export class DaneFaKorygowanej {
    // Data wystawienia faktury korygowanej
    @XmlElement({ name: "DataWystFaKorygowanej", order: 1, required: true })
    dataWystawienia: TData;

    // Numer faktury korygowanej
    @XmlElement({ name: "NrFaKorygowanej", order: 2, required: true })
    numerFaktury: TZnakowy;

    // Choice: faktura w KSeF lub poza KSeF
    // Znacznik faktury korygowanej w KSeF: 1=tak
    @XmlElement({ name: "NrKSeF", order: 3 })
    znacznikKSeF?: 1;

    // Numer KSeF faktury korygowanej
    @XmlElement({ name: "NrKSeFFaKorygowanej", order: 4 })
    numerKSeFFaKorygowanej?: TNumerKSeF;

    // Znacznik faktury korygowanej poza KSeF: 1=tak
    @XmlElement({ name: "NrKSeFN", order: 5 })
    znacznikPozaKSeF?: 1;
}

export class ZaliczkaCzesciowa {
    // Data otrzymania zaliczki
    @XmlElement({ name: "P_6Z", order: 1, required: true })
    dataOtrzymania: TData;

    // Kwota zaliczki
    @XmlElement({ name: "P_15Z", order: 2, required: true })
    kwota: TKwotowy;

    // Kurs waluty dla zaliczki
    @XmlElement({ name: "KursWalutyZW", order: 3 })
    kursWaluty?: TIlosc;
}

@XmlChoiceGroup({
    name: "numerKSeF",
    required: true,
    options: [["znacznikPozaKSeF", "numerFaktury"], ["numerKSeF"]],
})
export class FakturaZaliczkowa {
    // Choice: faktura poza KSeF lub w KSeF
    // Znacznik faktury zaliczkowej poza KSeF: 1=tak
    @XmlElement({ name: "NrKSeFZN", order: 1 })
    znacznikPozaKSeF?: 1;

    // dla faktur poza KSeF
    @XmlElement({ name: "NrFaZaliczkowej", order: 2 })
    numerFaktury?: TZnakowy;

    // Numer KSeF faktury zaliczkowej
    @XmlElement({ name: "NrKSeFFaZaliczkowej", order: 3 })
    numerKSeF?: TNumerKSeF;
}

export class DodatkowyOpis {
    @XmlElement({ name: "NrWiersza", order: 1 })
    nrWiersza?: TNaturalny;

    @XmlElement({ name: "Klucz", order: 2, required: true })
    klucz: TZnakowy;

    @XmlElement({ name: "Wartosc", order: 3, required: true })
    wartosc: TZnakowy;
}

/**
 * Zwolnienie od podatku VAT
 */
@XmlChoiceGroup({
    name: "zwolnienie",
    required: true,
    options: [
        ["zwolnienieTak", "podstawaUstawa"],
        ["zwolnienieTak", "podstawaDyrektywa"],
        ["zwolnienieTak", "podstawaInna"],
        ["zwolnienieNie"],
    ],
})
export class Zwolnienie {
    // Znacznik zwolnienia od podatku: 1=tak
    @XmlElement({ name: "P_19", order: 1 })
    zwolnienieTak?: 1;

    // Podstawa zwolnienia - przepis ustawy
    @XmlElement({ name: "P_19A", order: 2 })
    podstawaUstawa?: TZnakowy;

    // Podstawa zwolnienia - przepis dyrektywy 2006/112/WE
    @XmlElement({ name: "P_19B", order: 3 })
    podstawaDyrektywa?: TZnakowy;

    // Podstawa zwolnienia - inna podstawa prawna
    @XmlElement({ name: "P_19C", order: 4 })
    podstawaInna?: TZnakowy;

    // Znacznik braku zwolnienia: 1=brak zwolnienia
    @XmlElement({ name: "P_19N", order: 5 })
    zwolnienieNie?: 1;
}

@XmlChoiceGroup({
    name: "typSrodkaTransportu",
    required: false,
    options: [
        ["przebiegPojazdu", "numerVIN", "numerNadwozia", "numerPodwozia", "numerRamy", "typPojazdu"],
        ["godzinyJednostkiPlywajcej", "numerKadluba"],
        ["godzinyStatkuPowietrznego", "numerFabryczny"],
    ],
})
export class NowySrodekTransportu {}
