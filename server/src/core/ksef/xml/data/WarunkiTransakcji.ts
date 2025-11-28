import { KodWaluty } from "./KodWaluty";
import { Transport } from "./Transport";
import { Umowy } from "./Umowy";
import { Zamowienia } from "./Zamowienia";

export class WarunkiTransakcji {
    constructor(
        public Umowy: Umowy[] | undefined = undefined,
        public Zamowienia: Zamowienia[] | undefined = undefined,
        public NrPartiiTowaru: string[] | undefined = undefined,
        public WarunkiDostawy: string | undefined = undefined,
        public KursUmowny: number | undefined = undefined,
        public WalutaUmowna: KodWaluty | undefined = undefined,
        public Transport: Transport | undefined = undefined,
        public PodmiotPosredniczacy: 1 | undefined = undefined
    ) {}
}
