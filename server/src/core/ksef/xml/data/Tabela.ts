import { Suma } from "./Suma";
import { TMetaDane } from "./TMetaDane";
import { Wiersz } from "./Wiersz";
import { TNaglowek } from "./TNaglowek";

export class Tabela {
    constructor(public TMetaDane: TMetaDane[], public Opis: string, public TNaglowek: TNaglowek, public Wiersz: Wiersz[], public Suma: Suma) {}
}
