export interface INowySrodekTransportu {
    P_22A: string;
    P_NrWierszaNST: string;
    P_22BMK?: string;
    P_22BMD?: string;
    P_22BK?: string;
    P_22BNR?: string;
    P_22BRP?: string;
    P_22B?: string;
    P_22B1?: string;
    P_22B2?: string;
    P_22B3?: string;
    P_22B4?: string;
    P_22BT?: string;
    P_22C?: string;
    P_22C1?: string;
    P_22D?: string;
    P_22D1?: string;
}

export class NowySrodekTransportu {
    constructor(
        public P_22A: string,
        public P_NrWierszaNST: string,
        public P_22BMK: string | undefined = undefined,
        public P_22BMD: string | undefined = undefined,
        public P_22BK: string | undefined = undefined,
        public P_22BNR: string | undefined = undefined,
        public P_22BRP: string | undefined = undefined,
        public P_22B: string | undefined = undefined,
        public P_22B1: string | undefined = undefined,
        public P_22B2: string | undefined = undefined,
        public P_22B3: string | undefined = undefined,
        public P_22B4: string | undefined = undefined,
        public P_22BT: string | undefined = undefined,
        public P_22C: string | undefined = undefined,
        public P_22C1: string | undefined = undefined,
        public P_22D: string | undefined = undefined,
        public P_22D1: string | undefined = undefined
    ) {}
}
