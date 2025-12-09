import { IInformacje, Informacje } from "./Informacje";
import { IRejestry, Rejestry } from "./Rejestry";

export interface IStopka {
    Informacje?: IInformacje;
    Rejestry?: IRejestry;
}

export class Stopka {
    constructor(public Informacje?: Informacje, public Rejestry?: Rejestry) {}
}
