import { RodzajTransportu } from "./RodzajTransportu";
import { Przewoznik } from "./Przewoznik";
import { Adres } from "./Adres";

export class Transport {
    constructor(
        public RodzajTransportu: RodzajTransportu | undefined = undefined,
        public TransportInny: 1 | undefined = undefined,
        public OpisInnegoTransportu: string | undefined = undefined,
        public Przewoznik: Przewoznik | undefined = undefined,
        public NrZleceniaTransportu: string | undefined = undefined,
        public OpisLadunku: any,
        public LadunekInny: 1 | undefined = undefined,
        public OpisInnegoLadunku: string | undefined = undefined,
        public JednostkaOpakowania: string | undefined = undefined,
        public DataGodzRozpTransportu: string | undefined = undefined,
        public DataGodzZakTransportu: string | undefined = undefined,
        public WysylkaZ: Adres | undefined = undefined,
        public WysylkaPrzez: Adres | undefined = undefined,
        public WysylkaDo: Adres | undefined = undefined
    ) {}
}
