import { Email, IEmail } from "./Email";
import { ITelefon, Telefon } from "./Telefon";

export interface IDaneKontaktowe {
    Email?: IEmail;
    Telefon?: ITelefon;
}

export class DaneKontaktowe {
    constructor(public Email?: Email, public Telefon?: Telefon) {}
}
