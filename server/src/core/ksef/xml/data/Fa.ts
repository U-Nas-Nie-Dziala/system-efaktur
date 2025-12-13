import { IKodWaluty, KodWaluty } from "./KodWaluty";
import { IWZ, WZ } from "./WZ";
import { IOkresFa, OkresFa } from "./OkresFa";
import { IKursWalutyZ, KursWalutyZ } from "./KursWalutyZ";
import { Adnotacje, IAdnotacje } from "./Adnotacje";
import { IRodzajFaktury, RodzajFaktury } from "./RodzajFaktury";
import { ITypKorekty, TypKorekty } from "./TypKorekty";
import { DaneFaKorygowanej, IDaneFaKorygowanej } from "./DaneFaKorygowanej";
import { IPodmiot1K, Podmiot1K } from "./Podmiot1K";
import { IPodmiot2K, Podmiot2K } from "./Podmiot2K";
import { IZaliczkaCzesciowa, ZaliczkaCzesciowa } from "./ZaliczkaCzesciowa";
import { DodatkowyOpis, IDodatkowyOpis } from "./DodatkowyOpis";
import { FakturaZaliczkowa, IFakturaZaliczkowa } from "./FakturaZaliczkowa";
import { FaWiersz, IFaWiersz } from "./FaWiersz";
import { IRozliczenie, Rozliczenie } from "./Rozliczenie";
import { IPlatnosc, Platnosc } from "./Platnosc";
import { IWarunkiTransakcji, WarunkiTransakcji } from "./WarunkiTransakcji";
import { IZamowienie, Zamowienie } from "./Zamowienie";

export interface IFa {
    KodWaluty: IKodWaluty;
    P_1: string;
    P_1M?: string;
    P_2: string;
    WZ?: IWZ[];
    P_6?: string;
    OkresFa?: IOkresFa;
    P_13_1: number;
    P_14_1: number;
    P_14_1W?: number;
    P_13_2?: number; // sprawdzic
    P_14_2?: number; // sprawdzić
    P_14_2W?: number;
    P_13_3?: number; // sprawdzic
    P_14_3?: number; // sprawdzic
    P_14_3W?: number;
    P_13_4?: number; // sprawdzic
    P_14_4?: number; // sprawdzic
    P_14_4W?: number;
    P_13_5?: number; // sprawdzic
    P_14_5?: number;
    P_13_6_1?: number;
    P_13_6_2?: number;
    P_13_6_3?: number;
    P_13_7?: number;
    P_13_8?: number;
    P_13_9?: number;
    P_13_10?: number;
    P_13_11?: number;
    P_15: number;
    KursWalutyZ?: IKursWalutyZ;
    Adnotacje: IAdnotacje;
    RodzajFaktury: IRodzajFaktury;
    PrzyczynaKorekty?: string;
    TypKorekty?: ITypKorekty;
    DaneFaKorygowanej?: IDaneFaKorygowanej[];
    OkresFaKorygowanej?: string;
    NrFaKorygowany?: string;
    Podmiot1K?: IPodmiot1K;
    Podmiot2K?: IPodmiot2K;
    P_15ZK?: number;
    KursWalutyZK?: IKursWalutyZ;
    Zaliczka?: IZaliczkaCzesciowa;
    FP?: 1;
    TP?: 1;
    DodatkowyOpis?: IDodatkowyOpis[];
    FakturaZaliczkowa?: IFakturaZaliczkowa;
    ZwrotAkcyzy?: 1;
    FaWiersz: IFaWiersz[];
    Rozliczenie?: IRozliczenie;
    Platnosc?: IPlatnosc;
    WarunkiTransakcji?: IWarunkiTransakcji;
    Zamowienie?: IZamowienie;
}

export class Fa {
    constructor(
        public KodWaluty: KodWaluty,
        public P_1: string,
        public P_1M: string | undefined = undefined,
        public P_2: string,
        public WZ: WZ[] | undefined = undefined,
        public P_6: string | undefined = undefined,
        public OkresFa: OkresFa | undefined = undefined,
        public P_13_1: number,
        public P_14_1: number,
        public P_14_1W: number | undefined = undefined,
        public P_13_2: number | undefined = undefined, // sprawdzic
        public P_14_2: number | undefined = undefined, // sprawdzić
        public P_14_2W: number | undefined = undefined,
        public P_13_3: number | undefined = undefined, // sprawdzic
        public P_14_3: number | undefined = undefined, // sprawdzic
        public P_14_3W: number | undefined = undefined,
        public P_13_4: number | undefined = undefined, // sprawdzic
        public P_14_4: number | undefined = undefined, // sprawdzic
        public P_14_4W: number | undefined = undefined,
        public P_13_5: number | undefined = undefined, // sprawdzic
        public P_14_5: number | undefined = undefined,
        public P_13_6_1: number | undefined = undefined,
        public P_13_6_2: number | undefined = undefined,
        public P_13_6_3: number | undefined = undefined,
        public P_13_7: number | undefined = undefined,
        public P_13_8: number | undefined = undefined,
        public P_13_9: number | undefined = undefined,
        public P_13_10: number | undefined = undefined,
        public P_13_11: number | undefined = undefined,
        public P_15: number,
        public KursWalutyZ: KursWalutyZ | undefined = undefined,
        public Adnotacje: Adnotacje,
        public RodzajFaktury: RodzajFaktury,
        public PrzyczynaKorekty: string | undefined = undefined,
        public TypKorekty: TypKorekty | undefined = undefined,
        public DaneFaKorygowanej: DaneFaKorygowanej[] | undefined = undefined,
        public OkresFaKorygowanej: string | undefined = undefined,
        public NrFaKorygowany: string | undefined = undefined,
        public Podmiot1K: Podmiot1K | undefined = undefined,
        public Podmiot2K: Podmiot2K | undefined = undefined,
        public P_15ZK: number | undefined = undefined,
        public KursWalutyZK: KursWalutyZ | undefined = undefined,
        public Zaliczka: ZaliczkaCzesciowa | undefined = undefined,
        public FP: 1 | undefined = undefined,
        public TP: 1 | undefined = undefined,
        public DodatkowyOpis: DodatkowyOpis[] | undefined = undefined,
        public FakturaZaliczkowa: FakturaZaliczkowa | undefined = undefined,
        public ZwrotAkcyzy: 1 | undefined = undefined,
        public FaWiersz: FaWiersz[],
        public Rozliczenie?: Rozliczenie,
        public Platnosc?: Platnosc,
        public WarunkiTransakcji?: WarunkiTransakcji,
        public Zamowienie?: Zamowienie
    ) {}
}
