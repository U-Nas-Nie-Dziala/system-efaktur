import { InvoiceToXML } from "./../src/core/ksef/xml";
import { Faktura } from "./../src/core/ksef/xml/data/Faktura";
import { Naglowek } from "./../src/core/ksef/xml/data/Naglowek";
import { KodFormularza } from "./../src/core/ksef/xml/data/KodFormularza";
import fs from "fs";
import path from "path";

const xml = new InvoiceToXML();

const xmlString = xml.contract("Faktura", new Faktura(new Naglowek(new KodFormularza(), new Date().toISOString())));
fs.writeFileSync(path.resolve(process.cwd(), "./tests/test_xml.xml"), xmlString);
