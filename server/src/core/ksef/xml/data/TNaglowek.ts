import { IKol, Kol } from "./Kol";

export interface ITNaglowek {
    Value: IKol[];
}

export class TNaglowek {
    constructor(public Value: Kol[]) {}
}
