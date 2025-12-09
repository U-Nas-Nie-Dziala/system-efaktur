import { IKodKraju, KodKraju } from "./KodKraju";
import { INazwa, Nazwa } from "./Nazwa";
import { INIP, NIP } from "./NIP";

export interface IDaneIdentyfikacyjne2 {
    NIP?: INIP;
    Nazwa: INazwa;
    KodUE?: string;
    NrVatUE?: string;
    KodKraju?: IKodKraju;
    NrID?: string;
    BrakID?: 1;
}

export class DaneIdentyfikacyjne2 {
    constructor(
        public NIP: NIP | undefined = undefined,
        public Nazwa: Nazwa,
        public KodUE?: string,
        public NrVatUE?: string,
        public KodKraju?: KodKraju,
        public NrID?: string,
        public BrakID?: 1
    ) {}
}
