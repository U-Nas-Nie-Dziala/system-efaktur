import { IStopkaFaktury, StopkaFaktury } from "./StopkaFaktury";
import { IRejestry, Rejestry } from "./Rejestry";

export interface IInformacje {
    StopkaFaktury: IStopkaFaktury;
    Rejestry: IRejestry;
}

export class Informacje {
    constructor(public StopkaFaktury: StopkaFaktury, public Rejestry: Rejestry) {}
}
