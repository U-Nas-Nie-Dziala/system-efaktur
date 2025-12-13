// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT

// import xml2js from "xml2js";
// import convert from "xml-js";
// import fs from "fs";
// import path from "path";

// const xsdContent = fs.readFileSync(path.resolve(process.cwd(), "./src/core/ksef/fa3.xsd"), "utf-8");

// const read = (data: any) => JSON.stringify(data, null, 2);
// const save = (data: any) => fs.writeFileSync(path.resolve(process.cwd(), "./tests/test_contract.json"), data, "utf-8");

// import { type Fa3Root } from "./../src/core/ksef/types/invoce/TestTypes";
// const generate = async () => {
//     const contract = await xml2js.parseStringPromise(xsdContent);

//     const schema = contract["xsd:schema"];

//     const r = read(schema["xsd:element"][0]);
//     save(r);

//     return JSON.parse(r) as Fa3Root;
// };

// const createContract = async () => {
//     const xsd = await generate();
//     // xsd["xsd:complexType"][0].
//     // const root = xsd[0];
//     // const xmlContract = generateXmlFromElement(root);

//     const contract: { [key: string]: any } = {
//         _declaration: {
//             _attributes: {
//                 version: "1.0",
//                 encoding: "UTF-8",
//             },
//         },
//         Faktura: {
//             _attributes: {
//                 "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
//                 "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
//                 xmlns: "http://crd.gov.pl/wzor/2025/06/25/13775/",
//             },
//         },
//     };

//     contract["Faktura"]["ds"];

//     for (const i of xsd["xsd:complexType"][0]["xsd:sequence"]) {
//         for (const j of i["xsd:element"]) {
//             console.log(
//                 j["xsd:complexType"]?.map((v) => v["xsd:sequence"].map((v) => v["xsd:element"].map((v) => v.$.name)))
//             );
//         }
//     }

//     const xml = convert.json2xml(JSON.stringify(contract), { compact: true });

//     fs.writeFileSync(path.resolve(process.cwd(), "./tests/test_contract.xml"), xml, "utf-8");
// };

// createContract();

// export const mapSequence = () => {};

// export function generateXmlFromElement(element: any) {
//     const name = element.$.name;
//     const type = element.$.type;

//     // Prosta struktura - można rozbudować logikę
//     const xmlStructure = {
//         _declaration: {
//             _attributes: { version: "1.0", encoding: "UTF-8" },
//         },
//     };

//     // @ts-ignore
//     xmlStructure[name] = {
//         _text: getDefaultValueForType(type),
//     };

//     return xmlStructure;
// }

// export function getDefaultValueForType(type: any) {
//     if (!type) return "sample value";

//     if (type.includes("string")) return "example";
//     if (type.includes("integer")) return "0";
//     if (type.includes("decimal")) return "0.0";
//     if (type.includes("boolean")) return "false";
//     if (type.includes("date")) return "2024-01-01";

//     return "sample value";
// }
// ! UWAGA ! PLIK PORZUCONY - NIE UŻYWAĆ - MA POZOSTAĆ DLA CELÓW HISTORYCZNYCH JAKO ARTEFAKT
