import "reflect-metadata";
import { XmlAttribute, XmlElement, XmlNamespace } from "../decorators";
import { TKodFormularza } from "@repo/contract/ksef/enums";

export class KodFormularzaFa {
    @XmlAttribute({ name: "kodSystemowy", required: true })
    kodSystemowy: string = "FA (3)";

    @XmlAttribute({ name: "wersjaSchemy", required: true })
    wersjaSchemy: string = "1-0E";

    value: TKodFormularza = TKodFormularza.FA;
}

@XmlNamespace({
    prefix: "tns",
    uri: "http://crd.gov.pl/wzor/2025/06/25/13775/",
})
export class Naglowek {
    @XmlElement({ name: "KodFormularza", order: 1, required: true })
    kodFormularza: KodFormularzaFa;

    @XmlElement({ name: "WariantFormularza", order: 2, required: true })
    wariantFormularza: number = 3;

    @XmlElement({ name: "DataWytworzeniaFa", order: 3, required: true })
    dataWytworzeniaFa: string; // YYYY-MM-DD

    @XmlElement({ name: "SystemInfo", order: 4 })
    systemInfo?: string; // max 256 znaków
}
