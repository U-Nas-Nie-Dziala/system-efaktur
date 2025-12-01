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

            if (typeof el === "undefined") {
                continue;
            }

            if (i.startsWith("_")) {
                continue;
            }

            console.log(`Compile el: ${el}`);

            this.xml += `<${i}${
                el?._attributes ? " " + el._attributes.map((v: any, i: any) => `${v[0]}="${v[1]}"`).join(" ") : ""
            }>`;

            if (Array.isArray(el)) {
                this.deep(el);
                continue;
            }

            if (el?.Value) {
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

    public contract(tagName: string, obj: any): any {
        if (obj === null || obj === undefined) return "";

        // Jeśli to prymityw → zwracamy jako wartość tekstową taga:
        if (typeof obj !== "object") {
            return `<${tagName}>${this.escapeXml(String(obj))}</${tagName}>`;
        }

        let attributes = "";

        // Obsługa _attributes: [ [key,value], ... ]
        if (Array.isArray(obj._attributes)) {
            // @ts-ignore
            attributes = " " + obj._attributes.map(([k, v]) => `${k}="${this.escapeXml(String(v))}"`).join(" ");
        }

        // Jeśli obiekt ma pole Value → to jego treść
        if (Object.prototype.hasOwnProperty.call(obj, "Value")) {
            // Jeśli Value jest obiektem → rekurencja
            if (typeof obj.Value === "object") {
                return `<${tagName}${attributes}>${this.contract(tagName, obj.Value)}</${tagName}>`;
            }

            return `<${tagName}${attributes}>${this.escapeXml(String(obj.Value))}</${tagName}>`;
        }

        // Zwykłe pola → podtagi
        let inner = "";

        for (const key of Object.keys(obj)) {
            if (key === "_attributes" || key === "Value") continue;

            const value = obj[key];
            if (value === undefined || value === null) continue;

            // Tablice → wiele tagów
            if (Array.isArray(value)) {
                for (const element of value) {
                    inner += this.contract(key, element);
                }
            } else {
                inner += this.contract(key, value);
            }
        }

        return `<${tagName}${attributes}>${inner}</${tagName}>`;
    }

    public escapeXml(val: string): string {
        return val
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }
}
