import { ITMetaDane, TMetaDane } from "./TMetaDane";
import { IOpis, Opis } from "./Opis";
import { ITNaglowek, TNaglowek } from "./TNaglowek";
import { IWiersz, Wiersz } from "./Wiersz";
import { ISuma, Suma } from "./Suma";

export interface ITabela {
    TMetaDane: ITMetaDane[];
    Opis?: IOpis;
    TNaglowek: ITNaglowek;
    Wiersz: IWiersz[];
    Suma: ISuma;
}

export class Tabela {
    constructor(
        public TMetaDane: TMetaDane[],
        public Opis: Opis | undefined = undefined,
        public TNaglowek: TNaglowek,
        public Wiersz: Wiersz[],
        public Suma: Suma
    ) {}
}
