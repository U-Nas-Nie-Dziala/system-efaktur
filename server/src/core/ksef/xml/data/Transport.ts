import { IRodzajTransportu, RodzajTransportu } from "./RodzajTransportu";
import { IPrzewoznik, Przewoznik } from "./Przewoznik";
import { Adres, IAdres } from "./Adres";

export interface ITransport {
    RodzajTransportu?: IRodzajTransportu;
    TransportInny?: 1;
    OpisInnegoTransportu?: string;
    Przewoznik?: IPrzewoznik;
    NrZleceniaTransportu?: string;
    OpisLadunku?: any;
    LadunekInny?: 1;
    OpisInnegoLadunku?: string;
    JednostkaOpakowania?: string;
    DataGodzRozpTransportu?: string;
    DataGodzZakTransportu?: string;
    WysylkaZ?: IAdres;
    WysylkaPrzez?: IAdres;
    WysylkaDo?: IAdres;
}

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
