import { Faktura } from "./data/Faktura";

export class InvoiceToXML {
    private xml: string = `<?xml version="1.0" encoding="utf-16"?>`;

    constructor() {
        // this.xml += ``
    }

    private deep(obj: object) {
        for (const i in obj) {
            const ik = i as keyof object;
            const el = obj[ik] as any;

            if (i.startsWith("_")) {
                continue;
            }

            this.xml += `<${i}${el._attributes ? " " + el._attributes.map((v: any, i: any) => `${v[0]}="${v[1]}"`).join(" ") : ""}>`;

            if (el.Value) {
                this.xml += el.Value;
            } else {
                if (typeof obj[ik] === "object") {
                    this.deep(obj[ik]);
                }

                if (typeof el === "string" || typeof el === "number") {
                    this.xml += el;
                }
            }

            this.xml += `</${i}>`;
        }
    }

    public contract(rootElement: string, faktura: Faktura) {
        this.xml += `<${rootElement} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://crd.gov.pl/wzor/2025/06/25/13775/">`;
        this.deep(faktura);

        this.xml += `</${rootElement}>`;

        return this.xml;
    }
}
