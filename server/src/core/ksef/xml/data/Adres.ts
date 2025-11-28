import { AdresL1 } from "./AdresL1";
import { AdresL2 } from "./AdresL2";
import { KodKraju } from "./KodKraju";
import { GLN } from "./GLN";

export class Adres {
    constructor(public KodKraju: KodKraju, public AdresL1: AdresL1, public AdresL2?: AdresL2, public GLN?: GLN) {}
}
