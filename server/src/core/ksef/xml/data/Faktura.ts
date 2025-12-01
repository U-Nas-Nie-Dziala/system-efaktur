import { Fa } from "./Fa";
import { Naglowek } from "./Naglowek";
import { Podmiot1 } from "./Podmiot1";
import { Podmiot2 } from "./Podmiot2";
import { Podmiot3 } from "./Podmiot3";
import { PodmiotUpowazniony } from "./PodmiotUpowazniony";
import { Stopka } from "./Stopka";
import { Zalacznik } from "./Zalacznik";

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
