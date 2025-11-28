import { Adres } from "./Adres";
import { AdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";
import { DaneKontaktowe } from "./DaneKontaktowe";
import { GV } from "./GV";
import { JST } from "./JST";

export class Podmiot2 {
    constructor(
        public NrEORI: string | undefined = undefined,
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne2,
        public Adres: Adres,
        public AdresKoresp?: AdresKoresp,
        public DaneKontaktowe?: DaneKontaktowe,
        public NrKlienta?: string,
        public IDNabywcy?: string,
        public JST?: JST,
        public GV?: GV
    ) {}
}
