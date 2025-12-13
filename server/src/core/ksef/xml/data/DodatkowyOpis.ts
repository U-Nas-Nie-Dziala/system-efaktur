export interface IDodatkowyOpis {
    NrWiersza?: number;
    Klucz: string;
    Wartosc: string;
}

export class DodatkowyOpis {
    constructor(public NrWiersza: number | undefined = undefined, public Klucz: string, public Wartosc: string) {}
}
