import { ITKlucz, TKlucz } from "./TKlucz";
import { ITWartosc, TWartosc } from "./TWartosc";

export interface ITMetaDane {
    TKlucz: ITKlucz;
    TWartosc: ITWartosc;
}

export class TMetaDane {
    constructor(public TKlucz: TKlucz, public TWartosc: TWartosc) {}
}
