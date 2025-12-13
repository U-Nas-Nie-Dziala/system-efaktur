export interface IObciazenia {
    Kwota: number;
    Powod: string;
}

export class Obciazenia {
    constructor(public Kwota: number, public Powod: string) {}
}
