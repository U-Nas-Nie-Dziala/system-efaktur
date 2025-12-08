import { Podmiot1Params, NipParams, NazwaParams } from "../../types/ConstructorParams";
import { Nazwa, NIP, Podmiot1 } from "../data";

export class Podmiot1Builder {
    private elements: any[] = [];

    constructor() {
        this.elements = [];
    }

    public setNip(params: NipParams) {
        this.elements.push(new NIP(...params));
    }

    public setNazwa(params: NazwaParams) {
        this.elements.push(new Nazwa(...params));
    }

    public build(): Podmiot1 {
        return new Podmiot1(...(this.elements as Podmiot1Params));
    }
}
