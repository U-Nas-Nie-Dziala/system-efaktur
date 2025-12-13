import { KodWaluty } from "./KodWaluty";
import { ITransport, Transport } from "./Transport";
import { IUmowy, Umowy } from "./Umowy";
import { IZamowienia, Zamowienia } from "./Zamowienia";

export interface IWarunkiTransakcji {
    Umowy?: IUmowy[];
    Zamowienia?: IZamowienia[];
    NrPartiiTowaru?: string[];
    WarunkiDostawy?: string;
    KursUmowny?: number;
    WalutaUmowna?: KodWaluty;
    Transport?: ITransport;
    PodmiotPosredniczacy?: 1;
}

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
