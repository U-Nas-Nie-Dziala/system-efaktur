export interface ITerminOpis {
    Ilosc: number;
    Jednostka: string;
    ZdarzeniePoczatkowe: string;
}

export class TerminOpis {
    constructor(public Ilosc: number, public Jednostka: string, public ZdarzeniePoczatkowe: string) {}
}
