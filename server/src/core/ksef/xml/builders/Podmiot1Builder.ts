import { Podmiot1Params, NipParams, NazwaParams } from "../../types/ConstructorParams";
import { IAdres, IAdresKoresp, IDaneIdentyfikacyjne, IPodmiot1, Nazwa, NIP, Podmiot1 } from "../data";

export class Podmiot1Builder implements IPodmiot1 {
    public PrefiksPodatnika?: string;
    public NrEORI?: string;
    public DaneIdentyfikacyjne: IDaneIdentyfikacyjne;
    public Adres: IAdres;
    public AdresKoresp?: IAdresKoresp;

    constructor() {
        // this.elements = [];
    }

    // public setNip(params: NipParams) {
    //     this.elements.push(new NIP(...params));
    // }

    // public setNazwa(params: NazwaParams) {
    //     this.elements.push(new Nazwa(...params));
    // }

    // public build(): Podmiot1 {
    //     return new Podmiot1(...(this.elements as Podmiot1Params));
    // }
}
