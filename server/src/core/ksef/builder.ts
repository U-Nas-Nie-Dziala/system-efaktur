import { InvoiceToXML } from "./xml/index";
import { Faktura, Naglowek, Podmiot1 } from "./xml/data";
import { FakturaParams, NaglowekParams, Podmiot1Params } from "./types/ConstructorParams";

export class KsefBuilder {
    private elements: any[] = [];

    constructor() {
        this.elements = [];
    }

    public setFakturaNaglowek(params: NaglowekParams) {
        this.elements.push(new Naglowek(...params));
    }

    public setPodmiot1(params: Podmiot1Params) {
        this.elements.push(new Podmiot1(...params));
    }

    public build() {
        for (const el of this.elements) {
            if (el instanceof Naglowek) {
                // new Faktura(el, )
            }
        }
    }
}
