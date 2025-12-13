import { INowySrodekTransportu, NowySrodekTransportu } from "./NowySrodekTransportu";

export interface INoweSrodkiTransportu {
    P_22?: 1;
    P_45_2?: 1 | 2;
    NowySrodekTransportu?: INowySrodekTransportu[];
    P_22N?: 1;
}

export class NoweSrodkiTransportu {
    constructor(
        public P_22: 1 | undefined = undefined,
        public P_45_2: 1 | 2 | undefined = undefined,
        public NowySrodekTransportu: NowySrodekTransportu[] | undefined,
        public P_22N: 1 | undefined = undefined
    ) {}
}
