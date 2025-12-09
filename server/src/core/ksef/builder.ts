import { InvoiceToXML } from "./xml/index";
import { Faktura, IFaktura, Naglowek, Podmiot1 } from "./xml/data";
import { FakturaParams, NaglowekParams, Podmiot1Params } from "./types/ConstructorParams";

export class KsefBuilder {
    private root: IFaktura;

    public build(root: IFaktura) {
        this.root = root;
    }
}

const kb = new KsefBuilder();
kb.build({
    Naglowek: {
        KodFormularza: { Value: "3" },
        DataWytworzeniaFa: "2025-12-09",
    },
    Podmiot1: {
        DaneIdentyfikacyjne: {
            Nazwa: { Value: "Test Company" },
            NIP: { Value: "1234567890" },
        },
        Adres: {
            AdresL1: { Value: "123 Main St" },
            KodKraju: { Value: "PL" },
        },
    },
    Podmiot2: {
        DaneIdentyfikacyjne: {
            Nazwa: { Value: "Another Company" },
            NIP: { Value: "0987654321" },
        },
        Adres: {
            AdresL1: { Value: "456 Another St" },
            KodKraju: { Value: "PL" },
        },
    },
    Fa: {
        Adnotacje: {
            PMarzy: {
                P_PMarzyN: 1,
            },
            Zwolnienie: {
                P_19N: 1,
            },
        },
        KodWaluty: { Value: "PLN" },
        FaWiersz: [
            {
                NrWierszaFa: 1,
            },
        ],
        P_1: "213",
        P_2: "Some value",
        RodzajFaktury: { Value: "VAT" },
        P_13_1: 100,
        P_14_1: 23,
        P_15: 123,
    },
});
