import { NowySrodekTransportu } from "./NowySrodekTransportu";

export class NoweSrodkiTransportu {
    constructor(
        public P_22: 1,
        public P_45_2: 1 | 2,
        public NowySrodekTransportu: NowySrodekTransportu[] | undefined,
        public P_22N: 1 | undefined = undefined
    ) {}
}
