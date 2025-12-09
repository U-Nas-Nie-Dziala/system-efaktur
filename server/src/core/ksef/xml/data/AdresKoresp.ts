import { AdresL1, IAdresL1 } from "./AdresL1";
import { AdresL2, IAdresL2 } from "./AdresL2";
import { IKodKraju, KodKraju } from "./KodKraju";
import { GLN, IGLN } from "./GLN";

export interface IAdresKoresp {
    KodKraju: IKodKraju;
    AdresL1: IAdresL1;
    AdresL2?: IAdresL2;
    GLN?: IGLN;
}

export class AdresKoresp {
    constructor(public KodKraju: KodKraju, public AdresL1: AdresL1, public AdresL2?: AdresL2, public GLN?: GLN) {}
}
