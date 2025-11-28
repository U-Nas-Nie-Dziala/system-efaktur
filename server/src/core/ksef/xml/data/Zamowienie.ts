import { GTU } from "./GTU";
import { Procedura } from "./Procedura";
import { StawkaPodatku } from "./StawkaPodatku";
import { ZamowienieWiersz } from "./ZamowienieWiersz";

export class Zamowienie {
    constructor(public WartoscZamowienia: number, public ZamowienieWiersz: ZamowienieWiersz[]) {}
}
