import "reflect-metadata";
import { XmlArray, XmlChoiceGroup, XmlElement } from "../decorators";
import {
    TData,
    TDataCzas,
    TIlosc,
    TKwotowy,
    TNaturalny,
    TNumerKSeF,
    TProcentowy,
    TZnakowy,
    TZnakowy50,
    TZnakowy512,
} from "./simple-types";
import {
    TFormaPlatnosci,
    TGTU,
    TKodWaluty,
    TLadunek,
    TOznaczenieProcedury,
    TRodzajFaktury,
    TRodzajTransportu,
    TStawkaPodatku,
    TTypKorekty,
} from "@repo/contract/ksef/enums";
import { DaneIdentyfikacyjneNabywcy, Podmiot1K, Podmiot2K, RachunekBankowy } from "./entities";
import { TAdres } from "./address";

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
export class NowySrodekTransportu {
    @XmlElement({ name: "P_22A", order: 1, required: true })
    dataDopuszczenia: TData;

    @XmlElement({ name: "P_NrWierszaNST", order: 2, required: true })
    nrWiersza: TNaturalny;

    @XmlElement({ name: "P_22BMK", order: 3 })
    marka?: TZnakowy;

    @XmlElement({ name: "P_22BMD", order: 4 })
    model?: TZnakowy;

    @XmlElement({ name: "P_22BK", order: 5 })
    kolor?: TZnakowy;

    @XmlElement({ name: "P_22BNR", order: 6 })
    numerRejestracyjny?: TZnakowy;

    @XmlElement({ name: "P_22BRP", order: 7 })
    rokProdukcji?: TZnakowy;

    @XmlElement({ name: "P_22B", order: 8 })
    przebiegPojazdu?: TZnakowy;

    @XmlElement({ name: "P_22B1", order: 9 })
    numerVIN?: TZnakowy;

    @XmlElement({ name: "P_22B2", order: 10 })
    numerNadwozia?: TZnakowy;

    @XmlElement({ name: "P_22B3", order: 11 })
    numerPodwozia?: TZnakowy;

    @XmlElement({ name: "P_22B4", order: 12 })
    numerRamy?: TZnakowy;

    @XmlElement({ name: "P_22BT", order: 13 })
    typPojazdu?: TZnakowy;

    @XmlElement({ name: "P_22C", order: 14 })
    godzinyJednostkiPlywajcej?: TZnakowy;

    @XmlElement({ name: "P_22C1", order: 15 })
    numerKadluba?: TZnakowy;

    @XmlElement({ name: "P_22D", order: 16 })
    godzinyStatkuPowietrznego?: TZnakowy;

    @XmlElement({ name: "P_22D1", order: 17 })
    numerFabryczny?: TZnakowy;
}

@XmlChoiceGroup({
    name: "wdtNst",
    required: true,
    options: [["wdtNstTak", "obowiazekArt42Ust5", "srodkiTransportu"], ["wdtNstNie"]],
})
export class NoweSrodkiTransportu {
    @XmlElement({ name: "P_22", order: 1 })
    wdtNstTak?: 1;

    @XmlElement({ name: "P_42_5", order: 2 })
    obowiazekArt42Ust5?: 1 | 2;

    @XmlArray({ name: "NowySrodekTransportu", itemType: () => NowySrodekTransportu, order: 3 })
    srodkiTransportu?: NowySrodekTransportu[];

    @XmlElement({ name: "P_22N", order: 4 })
    wdtNstNie?: 1;
}

@XmlChoiceGroup({
    name: "proceduraMarzy",
    required: true,
    options: [
        ["marzyTak", "marzyBiuroPodrozy"],
        ["marzyTak", "marzyTowaryUzywane"],
        ["marzyTak", "marzyDzielaSztuki"],
        ["marzyTak", "marzyAntyki"],
        ["marzyNie"],
    ],
})
export class PMarzy {
    @XmlElement({ name: "P_PMarzy", order: 1 })
    marzyTak?: 1;

    @XmlElement({ name: "P_PMarzy_2", order: 2 })
    marzyBiuroPodrozy?: 1;

    @XmlElement({ name: "P_PMarzy_3_1", order: 3 })
    marzyTowaryUzywane?: 1;

    @XmlElement({ name: "P_PMarzy_3_2", order: 4 })
    marzyDzielaSztuki?: 1;

    @XmlElement({ name: "P_PMarzy_3_3", order: 5 })
    marzyAntyki?: 1;

    @XmlElement({ name: "P_PMarzyN", order: 6 })
    marzyNie?: 1;
}

export class Adnotacje {
    @XmlElement({ name: "P_16", order: 1, required: true })
    metodaKasowa: 1 | 2;

    @XmlElement({ name: "P_17", order: 2, required: true })
    samofakturowanie: 1 | 2;

    @XmlElement({ name: "P_18", order: 3, required: true })
    odwrotneObciazenie: 1 | 2;

    @XmlElement({ name: "P_18A", order: 4, required: true })
    splitPayment: 1 | 2;

    @XmlElement({ name: "Zwolnienie", order: 5, required: true })
    zwolnienie: Zwolnienie;

    @XmlElement({ name: "NoweSrodkiTransportu", order: 6, required: true })
    noweSrodkiTransportu: NoweSrodkiTransportu;

    @XmlElement({ name: "P_23", order: 7, required: true })
    proceduraUproszczonaWNT: 1 | 2;

    @XmlElement({ name: "PMarzy", order: 8, required: true })
    proceduraMarzy: PMarzy;
}

@XmlChoiceGroup({
    name: "formaPlatnosciCzesciowej",
    required: false,
    options: [["formaPlatnosci"], ["platnoscInna", "opisPlatnosci"]],
})
export class ZaplataCzesciowa {
    @XmlElement({ name: "KwotaZaplatyCzesciowej", order: 1, required: true })
    kwotaZaplatyCzesciowej: TKwotowy;

    @XmlElement({ name: "DataZaplatyCzesciowej", order: 2, required: true })
    dataZaplatyCzesciowej: TData;

    @XmlElement({ name: "FormaPlatnosci", order: 3 })
    formaPlatnosci?: TFormaPlatnosci;

    @XmlElement({ name: "PlatnoscInna", order: 4 })
    platnoscInna?: 1;

    @XmlElement({ name: "OpisPlatnosci", order: 5 })
    opisPlatnosci?: TZnakowy;
}

// opis terminu płatności
export class TerminOpis {
    @XmlElement({ name: "Ilosc", order: 1, required: true })
    ilosc: number;

    @XmlElement({ name: "Jednostka", order: 2, required: true })
    jednostka: TZnakowy50;

    @XmlElement({ name: "ZdarzeniePoczatkowe", order: 3, required: true })
    zdarzeniePoczatkowe: TZnakowy;
}

export class TerminPlatnosci {
    @XmlElement({ name: "Termin", order: 1 })
    termin?: TData;

    @XmlElement({ name: "TerminOpis", order: 2 })
    terminOpis?: TerminOpis;
}

export class Skonto {
    @XmlElement({ name: "WarunkiSkonta", order: 1, required: true })
    warunkiSkonta: TZnakowy;

    @XmlElement({ name: "WysokoscSkonta", order: 2, required: true })
    wysokoscSkonta: TZnakowy;
}

@XmlChoiceGroup({
    name: "statusZaplaty",
    required: false,
    options: [
        ["zaplacono", "dataZaplaty"],
        ["znacznikZaplatyCzesciowej", "zaplataCzesciowa"],
    ],
})
@XmlChoiceGroup({
    name: "formaPlatnosciGlowna",
    required: false,
    options: [["formaPlatnosci"], ["platnoscInna", "opisPlatnosci"]],
})
export class Platnosc {
    @XmlElement({ name: "Zaplacono", order: 1 })
    zaplacono?: 1;

    @XmlElement({ name: "DataZaplaty", order: 2 })
    dataZaplaty?: TData;

    @XmlElement({ name: "ZnacznikZaplatyCzesciowej", order: 3 })
    znacznikZaplatyCzesciowej?: 1 | 2;

    @XmlArray({ name: "ZaplataCzesciowa", itemType: () => ZaplataCzesciowa, order: 4 })
    zaplataCzesciowa?: ZaplataCzesciowa[];

    @XmlArray({ name: "TerminPlatnosci", itemType: () => TerminPlatnosci, order: 5 })
    terminPlatnosci?: TerminPlatnosci[];

    @XmlElement({ name: "FormaPlatnosci", order: 6 })
    formaPlatnosci?: TFormaPlatnosci;

    @XmlElement({ name: "PlatnoscInna", order: 7 })
    platnoscInna?: 1;

    @XmlElement({ name: "OpisPlatnosci", order: 8 })
    opisPlatnosci?: TZnakowy;

    @XmlArray({ name: "RachunekBankowy", itemType: () => RachunekBankowy, order: 9 })
    rachunekBankowy?: RachunekBankowy[];

    @XmlArray({ name: "RachunekBankowyFaktora", itemType: () => RachunekBankowy, order: 10 })
    rachunekBankowyFaktora?: RachunekBankowy[];

    @XmlElement({ name: "Skonto", order: 11 })
    skonto?: Skonto;

    @XmlElement({ name: "LinkDoPlatnosci", order: 12 })
    linkDoPlatnosci?: TZnakowy512;

    @XmlElement({ name: "IPKSeF", order: 13 })
    ipKSeF?: string;
}

export class Umowa {
    @XmlElement({ name: "DataUmowy", order: 1 })
    dataUmowy?: TData;

    @XmlElement({ name: "NrUmowy", order: 2 })
    nrUmowy?: TZnakowy;
}

export class ZamowienieRef {
    @XmlElement({ name: "DataZamowienia", order: 1 })
    dataZamowienia?: TData;

    @XmlElement({ name: "NrZamowienia", order: 2 })
    nrZamowienia?: TZnakowy;
}

export class Przewoznik {
    @XmlElement({ name: "DaneIdentyfikacyjne", order: 1, required: true })
    daneIdentyfikacyjne: DaneIdentyfikacyjneNabywcy;

    @XmlElement({ name: "AdresPrzewoznika", order: 2, required: true })
    adresPrzewoznika: TAdres;
}

@XmlChoiceGroup({
    name: "rodzajTransportu",
    required: false,
    options: [["rodzajTransportu"], ["transportInny", "opisInnegoTransportu"]],
})
@XmlChoiceGroup({
    name: "rodzajLadunku",
    required: false,
    options: [["opisLadunku"], ["ladunekInny", "opisInnegoLadunku"]],
})
export class Transport {
    @XmlElement({ name: "RodzajTransportu", order: 1 })
    rodzajTransportu?: TRodzajTransportu;

    @XmlElement({ name: "TransportInny", order: 2 })
    transportInny?: 1;

    @XmlElement({ name: "OpisInnegoTransportu", order: 3 })
    opisInnegoTransportu?: TZnakowy50;

    @XmlElement({ name: "Przewoznik", order: 4 })
    przewoznik?: Przewoznik;

    @XmlElement({ name: "NrZleceniaTransportu", order: 5 })
    nrZleceniaTransportu?: TZnakowy;

    // Ładunek
    @XmlElement({ name: "OpisLadunku", order: 6 })
    opisLadunku?: TLadunek;

    @XmlElement({ name: "LadunekInny", order: 7 })
    ladunekInny?: 1;

    @XmlElement({ name: "OpisInnegoLadunku", order: 8 })
    opisInnegoLadunku?: TZnakowy50;

    @XmlElement({ name: "JednostkaOpakowania", order: 9 })
    jednostkaOpakowania?: TZnakowy;

    @XmlElement({ name: "DataGodzRozpTransportu", order: 10 })
    dataGodzRozpTransportu?: TDataCzas;

    @XmlElement({ name: "DataGodzZakTransportu", order: 11 })
    dataGodzZakTransportu?: TDataCzas;

    @XmlElement({ name: "WysylkaZ", order: 12 })
    wysylkaZ?: TAdres;

    @XmlArray({ name: "WysylkaPrzez", itemType: () => TAdres, order: 13 })
    wysylkaPrzez?: TAdres[];

    @XmlElement({ name: "WysylkaDo", order: 14 })
    wysylkaDo?: TAdres;
}

export class WarunkiTransakcji {
    @XmlArray({ name: "Umowy", itemType: () => Umowa, order: 1 })
    umowy?: Umowa[];

    @XmlArray({ name: "Zamowienia", itemType: () => ZamowienieRef, order: 2 })
    zamowienia?: ZamowienieRef[];

    @XmlArray({ name: "NrPartiiTowaru", itemType: () => String, order: 3 })
    nrPartiiTowaru?: string[];

    @XmlElement({ name: "WarunkiDostawy", order: 4 })
    warunkiDostawy?: TZnakowy;

    @XmlElement({ name: "KursUmowny", order: 5 })
    kursUmowny?: TIlosc;

    @XmlElement({ name: "WalutaUmowna", order: 6 })
    walutaUmowna?: TKodWaluty;

    @XmlArray({ name: "Transport", itemType: () => Transport, order: 7 })
    transport?: Transport[];

    @XmlElement({ name: "PodmiotPosredniczacy", order: 8 })
    podmiotPosredniczacy?: 1;
}

export class Obciazenie {
    @XmlElement({ name: "Kwota", order: 1, required: true })
    kwota: TKwotowy;

    @XmlElement({ name: "Powod", order: 2, required: true })
    powod: TZnakowy;
}

export class Odliczenie {
    @XmlElement({ name: "Kwota", order: 1, required: true })
    kwota: TKwotowy;

    @XmlElement({ name: "Powod", order: 2, required: true })
    powod: TZnakowy;
}

@XmlChoiceGroup({
    name: "kwotaKoncowa",
    required: false,
    options: [["doZaplaty"], ["doRozliczenia"]],
})
export class Rozliczenie {
    @XmlArray({ name: "Obciazenia", itemType: () => Obciazenie, order: 1 })
    obciazenia?: Obciazenie[];

    @XmlElement({ name: "SumaObciazen", order: 2 })
    sumaObciazen?: TKwotowy;

    @XmlArray({ name: "Odliczenia", itemType: () => Odliczenie, order: 3 })
    odliczenia?: Odliczenie[];

    @XmlElement({ name: "SumaOdliczen", order: 4 })
    sumaOdliczen?: TKwotowy;

    @XmlElement({ name: "DoZaplaty", order: 5 })
    doZaplaty?: TKwotowy;

    @XmlElement({ name: "DoRozliczenia", order: 6 })
    doRozliczenia?: TKwotowy;
}

export class FaWiersz {
    @XmlElement({ name: "NrWierszaFa", order: 1, required: true })
    numerWiersza: TNaturalny;

    @XmlArray({ name: "UU_ID", itemType: () => String, order: 2 })
    identyfikatorUnikalny?: string[];

    @XmlElement({ name: "P_6A", order: 3 })
    dataDostawyPozycji?: TData;

    @XmlElement({ name: "P_7", order: 4 })
    nazwa?: TZnakowy;

    @XmlElement({ name: "IndeksN", order: 5 })
    indeksNabywcy?: TZnakowy;

    @XmlArray({ name: "IndeksZ", itemType: () => String, order: 6 })
    indeksyZewnetrzne?: string[];

    @XmlElement({ name: "P_8A", order: 7 })
    jednostkaMiary?: TZnakowy;

    @XmlElement({ name: "P_8B", order: 8 })
    ilosc?: TIlosc;

    @XmlElement({ name: "P_9A", order: 9 })
    cenaJednostkowaNetto?: TKwotowy;

    @XmlElement({ name: "P_9B", order: 10 })
    cenaJednostkowaBrutto?: TKwotowy;

    @XmlElement({ name: "P_10", order: 11 })
    rabat?: TKwotowy;

    @XmlElement({ name: "P_11", order: 12 })
    wartoscNetto?: TKwotowy;

    @XmlElement({ name: "P_11A", order: 13 })
    wartoscBrutto?: TKwotowy;

    @XmlElement({ name: "P_11Vat", order: 14 })
    kwotaVat?: TKwotowy;

    @XmlElement({ name: "P_12", order: 15 })
    stawkaVat?: TStawkaPodatku;

    @XmlElement({ name: "P_12_XII", order: 16 })
    stawkaVatXII?: TProcentowy;

    @XmlElement({ name: "P_12_Zal_15", order: 17 })
    zalacznik15?: 1;

    @XmlElement({ name: "KwotaAkcyzy", order: 18 })
    kwotaAkcyzy?: TKwotowy;

    @XmlElement({ name: "GTU", order: 19 })
    gtu?: TGTU;

    @XmlElement({ name: "Procedura", order: 20 })
    procedura?: TOznaczenieProcedury;

    @XmlElement({ name: "KursWaluty", order: 21 })
    kursWaluty?: TIlosc;

    @XmlElement({ name: "StanPrzed", order: 22 })
    stanPrzedKorekta?: 1;
}

@XmlChoiceGroup({
    name: "dataDostawy",
    required: false,
    options: [["dataDostawy"], ["okres"]],
})
export class Fa {
    @XmlElement({ name: "KodWaluty", order: 1, required: true })
    waluta: TKodWaluty;

    @XmlElement({ name: "P_1", order: 2, required: true })
    dataWystawienia: TData;

    @XmlElement({ name: "P_1M", order: 3 })
    miejsceWystawienia?: TZnakowy;

    @XmlElement({ name: "P_2", order: 4, required: true })
    numerFaktury: TZnakowy;

    @XmlArray({ name: "WZ", itemType: () => String, order: 5 })
    dokumentyWZ?: string[];

    @XmlElement({ name: "P_6", order: 6 })
    dataDostawy?: TData;

    @XmlElement({ name: "OkresFa", order: 7 })
    okres?: OkresFa;

    @XmlElement({ name: "P_13_1", order: 8 })
    sumaNetto23?: TKwotowy;

    @XmlElement({ name: "P_14_1", order: 9 })
    sumaVat23?: TKwotowy;

    @XmlElement({ name: "P_14_1W", order: 10 })
    sumaVat23Przeliczona?: TKwotowy;

    @XmlElement({ name: "P_13_2", order: 11 })
    sumaNetto8?: TKwotowy;

    @XmlElement({ name: "P_14_2", order: 12 })
    sumaVat8?: TKwotowy;

    @XmlElement({ name: "P_14_2W", order: 13 })
    sumaVat8Przeliczona?: TKwotowy;

    @XmlElement({ name: "P_13_3", order: 14 })
    sumaNetto5?: TKwotowy;

    @XmlElement({ name: "P_14_3", order: 15 })
    sumaVat5?: TKwotowy;

    @XmlElement({ name: "P_14_3W", order: 16 })
    sumaVat5Przeliczona?: TKwotowy;

    @XmlElement({ name: "P_13_4", order: 17 })
    sumaNetto0?: TKwotowy;

    @XmlElement({ name: "P_14_4", order: 18 })
    sumaVat0?: TKwotowy;

    @XmlElement({ name: "P_14_4W", order: 19 })
    sumaVat0Przeliczona?: TKwotowy;

    @XmlElement({ name: "P_13_5", order: 20 })
    sumaNettoZw?: TKwotowy;

    @XmlElement({ name: "P_14_5", order: 21 })
    sumaVatZw?: TKwotowy;

    @XmlElement({ name: "P_13_6_1", order: 22 })
    sumaNettoOO?: TKwotowy;

    @XmlElement({ name: "P_13_6_2", order: 23 })
    sumaNettoUslugiArt100?: TKwotowy;

    @XmlElement({ name: "P_13_6_3", order: 24 })
    sumaNettoWdtNst?: TKwotowy;

    @XmlElement({ name: "P_13_7", order: 25 })
    sumaNettoMarzy?: TKwotowy;

    @XmlElement({ name: "P_13_8", order: 26 })
    sumaNettoInne?: TKwotowy;

    @XmlElement({ name: "P_13_9", order: 27 })
    sumaNettoVatZagr?: TKwotowy;

    @XmlElement({ name: "P_13_10", order: 28 })
    sumaNettoOss?: TKwotowy;

    @XmlElement({ name: "P_13_11", order: 29 })
    sumaNettoStawkaXII?: TKwotowy;

    @XmlElement({ name: "P_15", order: 30, required: true })
    kwotaBrutto: TKwotowy;

    @XmlElement({ name: "KursWalutyZ", order: 31 })
    kursWalutyPodatek?: TIlosc;

    @XmlElement({ name: "Adnotacje", order: 32, required: true })
    adnotacje: Adnotacje;

    @XmlElement({ name: "RodzajFaktury", order: 33, required: true })
    rodzajFaktury: TRodzajFaktury;

    @XmlElement({ name: "PrzyczynaKorekty", order: 34 })
    przyczynaKorekty?: TZnakowy;

    @XmlElement({ name: "TypKorekty", order: 35 })
    typKorekty?: TTypKorekty;

    @XmlArray({ name: "DaneFaKorygowanej", itemType: () => DaneFaKorygowanej, order: 36 })
    fakturyKorygowane?: DaneFaKorygowanej[];

    @XmlElement({ name: "OkresFaKorygowanej", order: 37 })
    okresKorekty?: TZnakowy;

    @XmlElement({ name: "NrFaKorygowany", order: 38 })
    numerPoprawny?: TZnakowy;

    @XmlElement({ name: "Podmiot1K", order: 39 })
    sprzedawcaKorekta?: Podmiot1K;

    @XmlArray({ name: "Podmiot2K", itemType: () => Podmiot2K, order: 40 })
    nabywcaKorekta?: Podmiot2K[];

    @XmlElement({ name: "P_15ZK", order: 41 })
    kwotaPrzedKorekta?: TKwotowy;

    @XmlElement({ name: "KursWalutyZK", order: 42 })
    kursWalutyPrzedKorekta?: TIlosc;

    @XmlArray({ name: "ZaliczkaCzesciowa", itemType: () => ZaliczkaCzesciowa, order: 43 })
    zaliczkiCzesciowe?: ZaliczkaCzesciowa[];

    @XmlElement({ name: "FP", order: 44 })
    fakturaFP?: 1;

    @XmlElement({ name: "TP", order: 45 })
    powiazania?: 1;

    @XmlArray({ name: "DodatkowyOpis", itemType: () => DodatkowyOpis, order: 46 })
    dodatkoweOpisy?: DodatkowyOpis[];

    @XmlArray({ name: "FakturaZaliczkowa", itemType: () => FakturaZaliczkowa, order: 47 })
    fakturyZaliczkowe?: FakturaZaliczkowa[];

    @XmlElement({ name: "ZwrotAkcyzy", order: 48 })
    zwrotAkcyzy?: 1;

    @XmlArray({ name: "FaWiersz", itemType: () => FaWiersz, order: 49 })
    pozycje?: FaWiersz[];

    @XmlElement({ name: "Rozliczenie", order: 50 })
    rozliczenie?: Rozliczenie;

    @XmlElement({ name: "Platnosc", order: 51 })
    platnosc?: Platnosc;

    @XmlElement({ name: "WarunkiTransakcji", order: 52 })
    warunkiTransakcji?: WarunkiTransakcji;
}
