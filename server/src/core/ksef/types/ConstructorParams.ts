import { Faktura, Naglowek, Podmiot1, DaneIdentyfikacyjne, NIP, Nazwa } from "../xml/data";

export type FakturaParams = ConstructorParameters<typeof Faktura>;
export type NaglowekParams = ConstructorParameters<typeof Naglowek>;
export type Podmiot1Params = ConstructorParameters<typeof Podmiot1>;
export type DaneIdentyfikacyjneParams = ConstructorParameters<typeof DaneIdentyfikacyjne>;
export type NipParams = ConstructorParameters<typeof NIP>;
export type NazwaParams = ConstructorParameters<typeof Nazwa>;
