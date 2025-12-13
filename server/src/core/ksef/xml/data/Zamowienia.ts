export interface IZamowienia {
    DataZamowienia?: string;
    NrZamowienia?: string;
}

export class Zamowienia {
    constructor(public DataZamowienia?: string, public NrZamowienia?: string) {}
}
