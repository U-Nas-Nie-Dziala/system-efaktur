export class InvoiceToXML {
    private xml: string = `<?xml version="1.0" encoding="utf-16"?>`;

    constructor() {}

    public contract(tagName: string, obj: any): any {
        if (obj === null || obj === undefined) return "";

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
            if (typeof obj.Value === "object") {
                return `<${tagName}${attributes}>${this.contract(tagName, obj.Value)}</${tagName}>`;
            }

            return `<${tagName}${attributes}>${this.escapeXml(String(obj.Value))}</${tagName}>`;
        }

        let inner = "";

        for (const key of Object.keys(obj)) {
            if (key === "_attributes" || key === "Value") continue;

            const value = obj[key];
            if (value === undefined || value === null) continue;

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

    public toJSON(obj: any) {
        return JSON.stringify(obj);
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
