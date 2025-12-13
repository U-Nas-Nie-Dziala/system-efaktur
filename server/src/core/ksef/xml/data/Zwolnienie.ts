export interface IZwolnienie {
    P_19?: 1;
    P_19A?: string;
    P_19B?: string;
    P_19C?: string;
    P_19N?: 1;
}

export class Zwolnienie {
    constructor(
        public P_19: 1 | undefined = undefined,
        public P_19A: string | undefined = undefined,
        public P_19B: string | undefined = undefined,
        public P_19C: string | undefined = undefined,
        public P_19N: 1 | undefined = undefined
    ) {}
}
