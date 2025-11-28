import { Adres } from "./Adres";
import { AdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";
import { DaneKontaktowePU } from "./DaneKontaktowePU";
import { RolaPU } from "./RolaPU";

export class PodmiotUpowazniony {
    constructor(
        public NrEORI: string | undefined = undefined,
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne,
        public Adres: Adres,
        public AdresKoresp: AdresKoresp | undefined = undefined,
        public DaneKontaktowe: DaneKontaktowePU | undefined = undefined,
        public RolaPU: RolaPU
    ) {}
}
