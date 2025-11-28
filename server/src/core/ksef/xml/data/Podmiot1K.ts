import { Adres } from "./Adres";
import { DaneIdentyfikacyjne } from "./DaneIdentyfikacyjne";

export class Podmiot1K {
    constructor(
        public PrefiksPodatnika: string = "PL",
        public DaneIdentyfikacyjne: DaneIdentyfikacyjne,
        public Adres: Adres
    ) {}
}
