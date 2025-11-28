import { ZaplataCzesciowa } from "./ZaplataCzesciowa";
import { TerminPlatnosci } from "./TerminPlatnosci";
import { FormaPlatnosci } from "./FormaPlatnosci";
import { RachunekBankowy } from "./RachunekBankowy";
import { Skonto } from "./Skonto";

export class Platnosc {
    constructor(
        public Zaplacono: 1 | undefined = undefined,
        public DataZaplaty: string | undefined = undefined,
        public ZnacznikZaplatyCzesciowej: 1 | 2 | undefined = undefined,
        public ZaplataCzesciowa: ZaplataCzesciowa[] | undefined = undefined,
        public TerminPlatnosci: TerminPlatnosci | undefined = undefined,
        public FormaPlatnosci: FormaPlatnosci | undefined = undefined,
        public PlatnoscInna: 1 | undefined = undefined,
        public OpisPlatnosci: string | undefined = undefined,
        public RachunekBankowy: RachunekBankowy | undefined = undefined,
        public RachunekBankowyFaktora: RachunekBankowy | undefined = undefined,
        public Skonto?: Skonto,
        public LinkDoPlatnosci?: string,
        public IPKSeF?: string
    ) {}
}
