import { TMetaDane } from "./TMetaDane";
import { Opis } from "./Opis";
import { TNaglowek } from "./TNaglowek";
import { Wiersz } from "./Wiersz";
import { Suma } from "./Suma";

export class Tabela {
    constructor(
        public TMetaDane: TMetaDane[],
        public Opis: Opis | undefined = undefined,
        public TNaglowek: TNaglowek,
        public Wiersz: Wiersz[],
        public Suma: Suma
    ) {}
}
