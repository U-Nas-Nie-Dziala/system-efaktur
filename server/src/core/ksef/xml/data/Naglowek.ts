import { IKodFormularza, KodFormularza } from "./KodFormularza";

export interface INaglowek {
    KodFormularza: IKodFormularza;
    WariantFormularza?: string;
    DataWytworzeniaFa: string;
    SystemInfo?: string;
}

export class Naglowek {
    constructor(
        public KodFormularza: KodFormularza,
        public WariantFormularza: string = "3",
        public DataWytworzeniaFa: string,
        public SystemInfo?: string
    ) {}
}
