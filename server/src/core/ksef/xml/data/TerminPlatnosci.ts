import { ITerminOpis, TerminOpis } from "./TerminOpis";

export interface ITerminPlatnosci {
    Termin?: string;
    TerminOpis?: ITerminOpis;
}

export class TerminPlatnosci {
    constructor(public Termin?: string, public TerminOpis?: TerminOpis) {}
}
