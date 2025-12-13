export interface IRachunekBankowy {
    NrRB: string;
    SWIFT?: string;
    RachunekWlasnyBanku?: string;
    NazwaBanku?: string;
    OpisRachunku?: string;
}

export class RachunekBankowy {
    constructor(
        public NrRB: string,
        public SWIFT?: string,
        public RachunekWlasnyBanku?: string,
        public NazwaBanku?: string,
        public OpisRachunku?: string
    ) {}
}
