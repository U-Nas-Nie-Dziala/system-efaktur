import { Fa, IFa } from "./Fa";
import { INaglowek, Naglowek } from "./Naglowek";
import { IPodmiot1, Podmiot1 } from "./Podmiot1";
import { IPodmiot2, Podmiot2 } from "./Podmiot2";
import { IPodmiot3, Podmiot3 } from "./Podmiot3";
import { IPodmiotUpowazniony, PodmiotUpowazniony } from "./PodmiotUpowazniony";
import { IStopka, Stopka } from "./Stopka";
import { IZalacznik, Zalacznik } from "./Zalacznik";

export interface IFaktura {
    Naglowek: INaglowek;
    Podmiot1: IPodmiot1;
    Podmiot2: IPodmiot2;
    Podmiot3?: IPodmiot3;
    PodmiotUpowazniony?: IPodmiotUpowazniony;
    Fa: IFa;
    Stopka?: IStopka;
    Zalacznik?: IZalacznik;
}

export class Faktura {
    public readonly _attributes: [string, string][] = [
        ["xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance"],
        ["xmlns:xsd", "http://www.w3.org/2001/XMLSchema"],
        ["xmlns", "http://crd.gov.pl/wzor/2025/06/25/13775/"],
    ];

    constructor(
        public Naglowek: Naglowek,
        public Podmiot1: Podmiot1,
        public Podmiot2: Podmiot2,
        public Podmiot3: Podmiot3 | undefined = undefined,
        public PodmiotUpowazniony: PodmiotUpowazniony | undefined = undefined,
        public Fa: Fa,
        public Stopka?: Stopka,
        public Zalacznik?: Zalacznik
    ) {}
}
