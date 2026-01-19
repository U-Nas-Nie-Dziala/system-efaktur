import "reflect-metadata";
import { XmlArray, XmlAttribute, XmlElement } from "../decorators";
import { TZnakowy, TZnakowy2, TZnakowy512 } from "./simple-types";

export type TTypKolumny = "date" | "datetime" | "dec" | "int" | "time" | "txt";

export class KolumnaNaglowka {
    @XmlAttribute({ name: "Typ", required: true })
    typ: TTypKolumny;

    @XmlElement({ name: "NKom", order: 1, required: true })
    nazwaKolumny: TZnakowy2;
}

export class WierszTabeli {
    @XmlArray({ name: "WKom", itemType: () => String, order: 1 })
    komorki: TZnakowy2[];
}

export class SumaTabeli {
    @XmlArray({ name: "SKom", itemType: () => String, order: 1 })
    komorki: TZnakowy2[];
}

export class NaglowekTabeli {
    @XmlArray({ name: "Kol", itemType: () => KolumnaNaglowka, order: 1 })
    kolumny: KolumnaNaglowka[];
}

export class TabelaMetaDane {
    @XmlElement({ name: "TKlucz", order: 1, required: true })
    klucz: TZnakowy;

    @XmlElement({ name: "TWartosc", order: 2, required: true })
    wartosc: TZnakowy;
}

export class Tabela {
    @XmlArray({ name: "TMetaDane", itemType: () => TabelaMetaDane, order: 1 })
    metaDane?: TabelaMetaDane[];

    @XmlElement({ name: "Opis", order: 2 })
    opis?: TZnakowy512;

    @XmlElement({ name: "TNaglowek", order: 3, required: true })
    naglowek: NaglowekTabeli;

    @XmlArray({ name: "Wiersz", itemType: () => WierszTabeli, order: 4 })
    wiersze: WierszTabeli[];

    @XmlElement({ name: "Suma", order: 5 })
    suma?: SumaTabeli;
}

export class MetaDane {
    @XmlElement({ name: "ZKlucz", order: 1, required: true })
    klucz: TZnakowy;

    @XmlElement({ name: "ZWartosc", order: 2, required: true })
    wartosc: TZnakowy;
}

export class Tekst {
    @XmlArray({ name: "Akapit", itemType: () => String, order: 1 })
    akapity: TZnakowy512[];
}

export class BlokDanych {
    @XmlElement({ name: "ZNaglowek", order: 1 })
    naglowek?: TZnakowy512;

    @XmlArray({ name: "MetaDane", itemType: () => MetaDane, order: 2 })
    metaDane: MetaDane[];

    @XmlElement({ name: "Tekst", order: 3 })
    tekst?: Tekst;

    @XmlArray({ name: "Tabela", itemType: () => Tabela, order: 4 })
    tabele?: Tabela[];
}

export class Zalacznik {
    @XmlArray({ name: "BlokDanych", itemType: () => BlokDanych, order: 1 })
    blokiDanych: BlokDanych[];
}
