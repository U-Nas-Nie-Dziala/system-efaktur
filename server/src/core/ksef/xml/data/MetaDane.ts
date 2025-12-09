import { IZKlucz, ZKlucz } from "./ZKlucz";
import { IZWartosc, ZWartosc } from "./ZWartosc";

export interface IMetaDane {
    ZKlucz: IZKlucz;
    ZWartosc: IZWartosc;
}

export class MetaDane {
    constructor(public ZKlucz: ZKlucz, public ZWartosc: ZWartosc) {}
}
