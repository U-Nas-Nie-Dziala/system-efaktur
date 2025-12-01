import { KodKraju } from "./KodKraju";
import { Nazwa } from "./Nazwa";
import { NIP } from "./NIP";

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
