import { KodFormularza } from "./KodFormularza";

export class Naglowek {
    constructor(
        public KodFormularza: KodFormularza,
        public DataWytworzeniaFa: string,
        public WariantFormularza: string = "3",
        public SystemInfo: string = "Studencka Aplikacja Podatnika"
    ) {}
}
