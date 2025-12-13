import { Adres, IAdres } from "./Adres";
import { DaneIdentyfikacyjne, IDaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";

export interface IPodmiot1K {
    PrefiksPodatnika: string;
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne;
    Adres: IAdres;
}

export class Podmiot1K {
    constructor(
        public PrefiksPodatnika: string = "PL",
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne,
        public Adres: Adres
    ) {}
}
