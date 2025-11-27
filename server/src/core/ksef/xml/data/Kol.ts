import { NKom } from "./NKom";

export class Kol {
    public _attributes: ["Typ", "date" | "datetime" | "dec" | "int" | "time" | "txt"][] = [];

    constructor(public NKom: NKom) {}
}
