import "reflect-metadata";
import { XmlElement } from "../decorators";
import { TKodyKrajowUE } from "./enums";
import { TZnakowy, TGLN } from "./simple-types";

/**
 * Adres - tag: TAdres
 * Zgodny z XSD schemat FA(3)
 */
export class TAdres {
    @XmlElement({ name: "KodKraju", order: 1, required: true })
    kodKraju: TKodyKrajowUE | string; // TKodKraju z zewnętrznego schematu etd

    @XmlElement({ name: "AdresL1", order: 2, required: true })
    adresL1: TZnakowy;

    @XmlElement({ name: "AdresL2", order: 3 })
    adresL2?: TZnakowy;

    @XmlElement({ name: "GLN", order: 4 })
    gln?: TGLN;
}
