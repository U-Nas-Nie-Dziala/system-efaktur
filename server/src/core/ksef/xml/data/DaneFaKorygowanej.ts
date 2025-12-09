export interface IDaneFaKorygowanej {
    DataWystFaKorygowanej: string;
    NrFaKorygowanej: string;
    NrKSeF?: 1;
    NrKSeFFaKorygowanej?: string;
    NrKSeFN?: 1;
}

export class DaneFaKorygowanej {
    constructor(
        public DataWystFaKorygowanej: string,
        public NrFaKorygowanej: string,
        public NrKSeF: 1 | undefined = undefined,
        public NrKSeFFaKorygowanej: string | undefined = undefined,
        public NrKSeFN: 1 | undefined = undefined
    ) {}
}
