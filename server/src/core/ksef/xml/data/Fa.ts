import { KodWaluty } from "./KodWaluty";
import { WZ } from "./WZ";
import { OkresFa } from "./OkresFa";
import { KursWalutyZ } from "./KursWalutyZ";
import { Adnotacje } from "./Adnotacje";
import { RodzajFaktury } from "./RodzajFaktury";
import { TypKorekty } from "./TypKorekty";
import { DaneFaKorygowanej } from "./DaneFaKorygowanej";
import { Podmiot1K } from "./Podmiot1K";
import { Podmiot2K } from "./Podmiot2K";
import { ZaliczkaCzesciowa } from "./ZaliczkaCzesciowa";
import { DodatkowyOpis } from "./DodatkowyOpis";
import { FakturaZaliczkowa } from "./FakturaZaliczkowa";
import { FaWiersz } from "./FaWiersz";
import { Rozliczenie } from "./Rozliczenie";
import { Platnosc } from "./Platnosc";
import { WarunkiTransakcji } from "./WarunkiTransakcji";
import { Zamowienie } from "./Zamowienie";

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
