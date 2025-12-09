import { Adres, IAdres } from "./Adres";
import { AdresKoresp, IAdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne, IDaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";
import { DaneKontaktowe, IDaneKontaktowe } from "./DaneKontaktowe";

export interface IPodmiot1 {
    PrefiksPodatnika?: string;
    NrEORI?: string;
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne;
    Adres: IAdres;
    AdresKoresp?: IAdresKoresp;
    DaneKontaktowe?: IDaneKontaktowe;
    StatusInfoPodatnika?: 1 | 2 | 3 | 4;
}

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
