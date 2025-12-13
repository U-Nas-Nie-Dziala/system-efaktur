import { Adres, IAdres } from "./Adres";
import { DaneIdentyfikacyjne2, IDaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";

export interface IPrzewoznik {
    DaneIdentyfikacyjne: IDaneIdentyfikacyjne2;
    AdresPrzewoznika: IAdres;
}

export class Przewoznik {
    constructor(public DaneIdentyfikacyjne: DaneIdentyfikacyjne2, public AdresPrzewoznika: Adres) {}
}
