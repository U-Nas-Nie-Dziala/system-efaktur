import { IZNaglowek, ZNaglowek } from "./ZNaglowek";
import { IMetaDane, MetaDane } from "./MetaDane";
import { ITekst, Tekst } from "./Tekst";
import { ITabela, Tabela } from "./Tabela";

export interface IBlokDanych {
    ZNaglowek?: IZNaglowek;
    MetaDane: IMetaDane[];
    Tekst?: ITekst;
    Tabela: ITabela[];
}

export class BlokDanych {
    constructor(
        public ZNaglowek: ZNaglowek | undefined = undefined,
        public MetaDane: MetaDane[],
        public Tekst: Tekst | undefined = undefined,
        public Tabela: Tabela[]
    ) {}
}
