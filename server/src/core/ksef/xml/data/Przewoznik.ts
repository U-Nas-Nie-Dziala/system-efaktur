import { Adres } from "./Adres";
import { DaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";

export class Przewoznik {
    constructor(public DaneIdentyfikacyjne: DaneIdentyfikacyjne2, public AdresPrzewoznika: Adres) {}
}
