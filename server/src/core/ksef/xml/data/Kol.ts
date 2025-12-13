import { INKom, NKom } from "./NKom";

export interface IKol {
    _attributes?: ["Typ", "date" | "datetime" | "dec" | "int" | "time" | "txt"][];
    NKom: INKom;
}

export class Kol {
    public _attributes?: ["Typ", "date" | "datetime" | "dec" | "int" | "time" | "txt"][];

    constructor(public NKom: NKom) {}
}
