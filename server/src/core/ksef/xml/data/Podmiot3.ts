import { Adres } from "./Adres";
import { AdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";
import { DaneKontaktowe } from "./DaneKontaktowe";
import { OpisRoli } from "./OpisRoli";
import { Rola } from "./Rola";
import { RolaInna } from "./RolaInna";

export class Podmiot3 {
    constructor(
        public IDNabywcy: string | undefined = undefined,
        public NrEORI: string | undefined = undefined,
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne2,
        public Adres?: Adres,
        public AdresKoresp?: AdresKoresp,
        public DaneKontaktowe?: DaneKontaktowe,
        public Rola?: Rola,
        public RolaInna?: RolaInna,
        public OpisRoli?: OpisRoli,
        public Udzial?: string,
        public NrKlienta?: string
    ) {}
}
