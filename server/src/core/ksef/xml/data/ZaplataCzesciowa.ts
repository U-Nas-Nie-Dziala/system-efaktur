import { FormaPlatnosci, IFormaPlatnosci } from "./FormaPlatnosci";

export interface IZaplataCzesciowa {
    KwotaZaplatyCzesciowej: number;
    DataZaplatyCzesciowej: string;
    FormaPlatnosci?: IFormaPlatnosci;
    PlatnoscInna?: 1;
    OpisPlatnosci?: string;
}

export class ZaplataCzesciowa {
    constructor(
        public KwotaZaplatyCzesciowej: number,
        public DataZaplatyCzesciowej: string,
        public FormaPlatnosci: FormaPlatnosci | undefined = undefined,
        public PlatnoscInna: 1 | undefined = undefined,
        public OpisPlatnosci: string | undefined = undefined
    ) {}
}
