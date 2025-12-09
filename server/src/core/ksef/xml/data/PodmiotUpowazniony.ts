import { Adres, IAdres } from "./Adres";
import { AdresKoresp, IAdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne, IDaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";
import { DaneKontaktowePU, IDaneKontaktowePU } from "./DaneKontaktowePU";
import { IRolaPU, RolaPU } from "./RolaPU";

export interface IPodmiotUpowazniony {
    NrEORI?: string;
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne;
    Adres: IAdres;
    AdresKoresp?: IAdresKoresp;
    DaneKontaktowe?: IDaneKontaktowePU;
    RolaPU: IRolaPU;
}

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
