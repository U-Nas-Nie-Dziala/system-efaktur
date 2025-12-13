import { Adres, IAdres } from "./Adres";
import { DaneIdentyfikacyjne2, IDaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";

export interface IPodmiot2K {
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne2;
    Adres?: IAdres;
    IDNabywcy?: string;
}

export class Podmiot2K {
    constructor(public DaneIdentyfikacyjne: DaneIdentyfikacyjne2, public Adres?: Adres, public IDNabywcy?: string) {}
}
