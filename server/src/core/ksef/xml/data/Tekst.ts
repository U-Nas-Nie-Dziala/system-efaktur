import { Akapit, IAkapit } from "./Akapit";

export interface ITekst {
    Akapit: IAkapit;
}

export class Tekst {
    constructor(public Akapit: Akapit) {}
}
