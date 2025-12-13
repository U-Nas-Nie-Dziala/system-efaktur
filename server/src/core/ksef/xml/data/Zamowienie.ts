import { IZamowienieWiersz, ZamowienieWiersz } from "./ZamowienieWiersz";

export interface IZamowienie {
    WartoscZamowienia: number;
    ZamowienieWiersz: IZamowienieWiersz[];
}

export class Zamowienie {
    constructor(public WartoscZamowienia: number, public ZamowienieWiersz: ZamowienieWiersz[]) {}
}
