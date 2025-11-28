import { Obciazenia } from "./Obciazenia";
import { Odliczenia } from "./Odliczenia";

export class Rozliczenie {
    constructor(
        public Obciazenia: Obciazenia[],
        public SumaObciazen: number | undefined = undefined,
        public Odliczenia: Odliczenia[],
        public SumaOdliczen: number | undefined = undefined,
        public DoZaplaty: number | undefined = undefined,
        public DoRozliczenia: number | undefined = undefined
    ) {}
}
