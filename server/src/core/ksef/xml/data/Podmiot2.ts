import { Adres, IAdres } from "./Adres";
import { AdresKoresp, IAdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne2, IDaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";
import { DaneKontaktowe, IDaneKontaktowe } from "./DaneKontaktowe";
import { GV, IGV } from "./GV";
import { IJST, JST } from "./JST";

export interface IPodmiot2 {
    NrEORI?: string;
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne2;
    Adres: IAdres;
    AdresKoresp?: IAdresKoresp;
    DaneKontaktowe?: IDaneKontaktowe;
    NrKlienta?: string;
    IDNabywcy?: string;
    JST?: IJST;
    GV?: IGV;
}

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
