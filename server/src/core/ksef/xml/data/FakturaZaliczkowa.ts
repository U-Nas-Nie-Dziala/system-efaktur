export interface IFakturaZaliczkowa {
    NrKSeFZN: 1;
    NrFaZaliczkowej: string;
    NrKSeFFaZaliczkowej: string;
}

export class FakturaZaliczkowa {
    constructor(public NrKSeFZN: 1, public NrFaZaliczkowej: string, public NrKSeFFaZaliczkowej: string) {}
}
