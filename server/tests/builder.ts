import { InvoiceToXML } from "./../src/core/ksef/xml";
import { Faktura } from "./../src/core/ksef/xml/data/Faktura";
import { Naglowek } from "./../src/core/ksef/xml/data/Naglowek";
import { KodFormularza } from "./../src/core/ksef/xml/data/KodFormularza";
import fs from "fs";
import path from "path";
import { Podmiot1 } from "../src/core/ksef/xml/data/Podmiot1";
import { DaneIdentyfikacyjne } from "../src/core/ksef/xml/data/DaneIdentyfikacyjne";
import { NIP } from "../src/core/ksef/xml/data/NIP";
import { Nazwa } from "../src/core/ksef/xml/data/Nazwa";
import { Adres } from "../src/core/ksef/xml/data/Adres";
import { AdresL1 } from "../src/core/ksef/xml/data/AdresL1";
import { KodKraju } from "../src/core/ksef/xml/data/KodKraju";
import { Podmiot2 } from "../src/core/ksef/xml/data/Podmiot2";
import { DaneIdentyfikacyjne2 } from "../src/core/ksef/xml/data/DaneIdentyfikacyjne2";
import { Fa } from "../src/core/ksef/xml/data/Fa";
import { KodWaluty } from "../src/core/ksef/xml/data/KodWaluty";
import { Adnotacje } from "../src/core/ksef/xml/data/Adnotacje";
import { Zwolnienie } from "../src/core/ksef/xml/data/Zwolnienie";
import { NoweSrodkiTransportu } from "../src/core/ksef/xml/data/NoweSrodkiTransportu";
import { PMarzy } from "../src/core/ksef/xml/data/PMarzy";
import { RodzajFaktury } from "../src/core/ksef/xml/data/RodzajFaktury";
import { FaWiersz } from "../src/core/ksef/xml/data/FaWiersz";
import { StawkaPodatku } from "../src/core/ksef/xml/data/StawkaPodatku";
import { JST } from "../src/core/ksef/xml/data/JST";
import { GV } from "../src/core/ksef/xml/data/GV";

const xml = new InvoiceToXML();

const naglowek = new Naglowek(new KodFormularza(), "3", new Date().toISOString());
const adresP1 = new Adres(new KodKraju("PL"), new AdresL1("test 13/23 15-xxx Bialystok"));

const podmiot1 = new Podmiot1(
    undefined,
    undefined,
    new DaneIdentyfikacyjne(new NIP("2451407584"), new Nazwa("Test Company")),
    adresP1
);

const podmiot2 = new Podmiot2(
    undefined,
    new DaneIdentyfikacyjne2(
        new NIP("9753144889"),
        new Nazwa("test sp.z.o.o"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    ),
    adresP1,
    undefined,
    undefined,
    undefined,
    undefined,
    new JST(2),
    new GV(2)
);

const ad = new Adnotacje(
    2,
    2,
    2,
    2,
    new Zwolnienie(undefined, undefined, undefined, undefined, 1),
    new NoweSrodkiTransportu(undefined, undefined, undefined, 1),
    2,
    new PMarzy(undefined, undefined, undefined, undefined, undefined, 1)
);

const faw = new FaWiersz(
    1,
    undefined,
    undefined,
    "test123",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "szt.",
    1,
    100,
    undefined,
    undefined,
    100,
    undefined,
    undefined,
    new StawkaPodatku("23")
);

const faContent = new Fa(
    new KodWaluty("PLN"),
    new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    "Testowo",
    "2025/11-28/SSD-dasdakshdak21313",
    undefined,
    undefined,
    undefined,
    100,
    23,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    123,
    undefined,
    ad,
    new RodzajFaktury("VAT"),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    [faw]
);

const xmlString = xml.contract("Faktura", new Faktura(naglowek, podmiot1, podmiot2, undefined, undefined, faContent));
fs.writeFileSync(path.resolve(process.cwd(), "./tests/test_xml.xml"), xmlString);
