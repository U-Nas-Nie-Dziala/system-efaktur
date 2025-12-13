export interface IOdliczenia {
    Kwota: number;
    Powod: string;
}

export class Odliczenia {
    constructor(public Kwota: number, public Powod: string) {}
}
