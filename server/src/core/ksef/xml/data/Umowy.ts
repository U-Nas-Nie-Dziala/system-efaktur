export interface IUmowy {
    DataUmowy?: string;
    NrUmowy?: string;
}

export class Umowy {
    constructor(public DataUmowy?: string, public NrUmowy?: string) {}
}
