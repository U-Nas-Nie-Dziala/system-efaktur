import { IObciazenia, Obciazenia } from "./Obciazenia";
import { IOdliczenia, Odliczenia } from "./Odliczenia";

export interface IRozliczenie {
    Obciazenia: IObciazenia[];
    SumaObciazen?: number;
    Odliczenia: IOdliczenia[];
    SumaOdliczen?: number;
    DoZaplaty?: number;
    DoRozliczenia?: number;
}

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
