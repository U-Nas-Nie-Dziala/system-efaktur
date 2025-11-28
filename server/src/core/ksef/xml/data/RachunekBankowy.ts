export class RachunekBankowy {
    constructor(
        public NrRB: string,
        public SWIFT?: string,
        public RachunekWlasnyBanku?: string,
        public NazwaBanku?: string,
        public OpisRachunku?: string
    ) {}
}
