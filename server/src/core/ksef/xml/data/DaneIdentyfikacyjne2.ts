import { KodKraju } from "./KodKraju";
import { NIP } from "./NIP";

export class DaneIdentyfikacyjne2 {
    constructor(
        public Nazwa: string,
        public NIP?: NIP,
        public KodUE?: string,
        public NrVatUE?: string,
        public KodKraju?: KodKraju,
        public NrID?: string,
        public BrakID?: 1
    ) {}
}
