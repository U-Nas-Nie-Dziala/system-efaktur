export interface IPMarzy {
    P_PMarzy?: 1;
    P_PMarzy_2?: 1;
    P_PMarzy_3_1?: 1;
    P_PMarzy_3_2?: 1;
    P_PMarzy_3_3?: 1;
    P_PMarzyN?: 1;
}

export class PMarzy {
    constructor(
        public P_PMarzy: 1 | undefined = undefined,
        public P_PMarzy_2: 1 | undefined = undefined,
        public P_PMarzy_3_1: 1 | undefined = undefined,
        public P_PMarzy_3_2: 1 | undefined = undefined,
        public P_PMarzy_3_3: 1 | undefined = undefined,
        public P_PMarzyN: 1 | undefined = undefined
    ) {}
}
