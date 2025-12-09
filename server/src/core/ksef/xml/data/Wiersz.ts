import { IWKom, WKom } from "./WKom";

export interface IWiersz {
    Wiersz: IWKom[];
}

export class Wiersz {
    constructor(public Wiersz: WKom[]) {}
}
