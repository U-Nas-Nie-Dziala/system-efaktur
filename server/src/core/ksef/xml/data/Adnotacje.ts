import { INoweSrodkiTransportu, NoweSrodkiTransportu } from "./NoweSrodkiTransportu";
import { IPMarzy, PMarzy } from "./PMarzy";
import { IZwolnienie, Zwolnienie } from "./Zwolnienie";

export interface IAdnotacje {
    P_16?: 1 | 2;
    P_17?: 1 | 2;
    P_18?: 1 | 2;
    P_18A?: 1 | 2;
    Zwolnienie?: IZwolnienie;
    NoweSrodkiTransportu?: INoweSrodkiTransportu;
    P_23?: 1 | 2;
    PMarzy?: IPMarzy;
}

export class Adnotacje {
    constructor(
        public P_16: 1 | 2,
        public P_17: 1 | 2,
        public P_18: 1 | 2,
        public P_18A: 1 | 2,
        public Zwolnienie: Zwolnienie,
        public NoweSrodkiTransportu: NoweSrodkiTransportu,
        public P_23: 1 | 2,
        public PMarzy: PMarzy
    ) {}
}
