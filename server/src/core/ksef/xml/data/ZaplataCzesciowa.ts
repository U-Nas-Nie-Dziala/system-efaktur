import { FormaPlatnosci } from "./FormaPlatnosci";

export class ZaplataCzesciowa {
    constructor(
        public KwotaZaplatyCzesciowej: number,
        public DataZaplatyCzesciowej: string,
        public FormaPlatnosci: FormaPlatnosci | undefined = undefined,
        public PlatnoscInna: 1 | undefined = undefined,
        public OpisPlatnosci: string | undefined = undefined
    ) {}
}
