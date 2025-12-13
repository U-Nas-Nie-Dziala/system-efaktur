import { INIP, NIP } from "./NIP";
import { INazwa, Nazwa } from "./Nazwa";

export interface IDaneIdentyfikacyjne {
    NIP: INIP;
    Nazwa: INazwa;
}

export class DaneIdentyfikacyjne {
    constructor(public NIP: NIP, public Nazwa: Nazwa) {}
}
