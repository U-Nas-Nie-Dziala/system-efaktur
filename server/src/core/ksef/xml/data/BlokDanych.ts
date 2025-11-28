import { ZNaglowek } from "./ZNaglowek";
import { MetaDane } from "./MetaDane";
import { Tekst } from "./Tekst";
import { Tabela } from "./Tabela";

export class BlokDanych {
    constructor(
        public ZNaglowek: ZNaglowek | undefined = undefined,
        public MetaDane: MetaDane[],
        public Tekst: Tekst | undefined = undefined,
        public Tabela: Tabela[]
    ) {}
}
