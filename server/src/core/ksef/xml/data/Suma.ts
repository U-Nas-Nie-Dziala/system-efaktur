import { ISKom, SKom } from "./SKom";

export interface ISuma {
    Value: ISKom[];
}

export class Suma {
    constructor(public Value: SKom[]) {}
}
