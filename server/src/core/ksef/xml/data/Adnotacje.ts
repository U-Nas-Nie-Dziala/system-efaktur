import { NoweSrodkiTransportu } from "./NoweSrodkiTransportu";
import { PMarzy } from "./PMarzy";
import { Zwolnienie } from "./Zwolnienie";

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
