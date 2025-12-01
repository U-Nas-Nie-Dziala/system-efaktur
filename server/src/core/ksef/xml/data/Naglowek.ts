import { KodFormularza } from "./KodFormularza";

export class Naglowek {
    constructor(
        public KodFormularza: KodFormularza,
        public WariantFormularza: string = "3",
        public DataWytworzeniaFa: string,
        public SystemInfo?: string
    ) {}
}
