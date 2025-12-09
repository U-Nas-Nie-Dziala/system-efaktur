import { Adres, IAdres } from "./Adres";
import { AdresKoresp, IAdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne2, IDaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";
import { DaneKontaktowe, IDaneKontaktowe } from "./DaneKontaktowe";
import { IOpisRoli, OpisRoli } from "./OpisRoli";
import { IRola, Rola } from "./Rola";
import { IRolaInna, RolaInna } from "./RolaInna";

export interface IPodmiot3 {
    IDNabywcy?: string;
    NrEORI?: string;
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne2;
    Adres?: IAdres;
    AdresKoresp?: IAdresKoresp;
    DaneKontaktowe?: IDaneKontaktowe;
    Rola?: IRola;
    RolaInna?: IRolaInna;
    OpisRoli?: IOpisRoli;
    Udzial?: string;
    NrKlienta?: string;
}

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
