/**
 * KSeF Faktura - główna klasa faktury
 */

import "reflect-metadata";
import { XmlArray, XmlElement, XmlNamespace, XmlRoot } from "../decorators";
import { TZnakowy } from "./simple-types";
import { Podmiot1, Podmiot2, Podmiot3, PodmiotUpowazniony } from "./entities";
import { Naglowek } from "./header";
import { Zalacznik } from "./invoice-items";
import { Fa } from "./invoice";

export class Stopka {
    @XmlElement({ name: "Informacje", order: 1 })
    informacje?: TZnakowy;

    @XmlElement({ name: "Rejestry", order: 2 })
    rejestry?: TZnakowy;
}

@XmlRoot({
    name: "Faktura",
    namespace: "http://crd.gov.pl/wzor/2025/06/25/13775/",
})
@XmlNamespace({
    prefix: "etd",
    uri: "http://crd.gov.pl/xml/schematy/dziedzinowe/mf/2022/01/05/eD/DefinicjeTypy/",
})
@XmlNamespace({
    prefix: "xsi",
    uri: "http://www.w3.org/2001/XMLSchema-instance",
})
@XmlNamespace({
    prefix: "",
    uri: "http://crd.gov.pl/wzor/2025/06/25/13775/",
})
export class Faktura {
    @XmlElement({ name: "Naglowek", order: 1, required: true })
    naglowek: Naglowek;

    // Podmiot 1 - Sprzedawca
    @XmlElement({ name: "Podmiot1", order: 2, required: true })
    podmiot1: Podmiot1;

    // Podmiot 2 - Nabywca
    @XmlElement({ name: "Podmiot2", order: 3, required: true })
    podmiot2: Podmiot2;

    // Podmiot 3 - dodatkowe podmioty (opcjonalne, bez ograniczeń liczby)
    @XmlArray({ name: "Podmiot3", itemType: () => Podmiot3, order: 4 })
    podmioty3?: Podmiot3[];

    @XmlElement({ name: "PodmiotUpowazniony", order: 5 })
    podmiotUpowazniony?: PodmiotUpowazniony;

    @XmlElement({ name: "Fa", order: 6, required: true })
    fa: Fa;

    @XmlElement({ name: "Stopka", order: 7 })
    stopka?: Stopka;

    @XmlArray({ name: "Zalacznik", itemType: () => Zalacznik, order: 8 })
    zalaczniki?: Zalacznik[];
}
