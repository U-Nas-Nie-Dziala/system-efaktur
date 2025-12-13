export interface IRejestry {
    PelnaNazwa?: string;
    KRS?: string;
    REGON?: string;
    BDO?: string;
}

export class Rejestry {
    constructor(public PelnaNazwa?: string, public KRS?: string, public REGON?: string, public BDO?: string) {}
}
