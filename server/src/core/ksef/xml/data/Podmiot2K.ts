import { Adres } from "./Adres";
import { AdresKoresp } from "./AdresKoresp";
import { DaneIdentyfikacyjne2 } from "./DaneIdentyfikacyjne2";
import { DaneKontaktowe } from "./DaneKontaktowe";
import { GV } from "./GV";
import { JST } from "./JST";

export class Podmiot2K {
    constructor(public DaneIdentyfikacyjne: DaneIdentyfikacyjne2, public Adres?: Adres, public IDNabywcy?: string) {}
}
