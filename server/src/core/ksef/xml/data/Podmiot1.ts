import { Adres } from "./Adres";
import { AdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";
import { DaneKontaktowe } from "./DaneKontaktowe";

export class Podmiot1 {
    constructor(
        public PrefiksPodatnika: string | undefined = undefined,
        public NrEORI: string | undefined = undefined,
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne,
        public Adres: Adres,
        public AdresKoresp?: AdresKoresp,
        public DaneKontaktowe?: DaneKontaktowe,
        public StatusInfoPodatnika?: 1 | 2 | 3 | 4
    ) {}
}
