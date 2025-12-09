import { GTU, IGTU } from "./GTU";
import { IProcedura, Procedura } from "./Procedura";
import { IStawkaPodatku, StawkaPodatku } from "./StawkaPodatku";

export interface IFaWiersz {
    NrWierszaFa: number;
    UU_ID?: string;
    P_6A?: string;
    P_7?: string;
    Indeks?: string;
    GTIN?: string;
    PKWiU?: string;
    CN?: string;
    PKOB?: string;
    P_8A?: string;
    P_8B?: number;
    P_9A?: number;
    P_9B?: number;
    P_10?: number;
    P_11?: number;
    P_11A?: number;
    P_11Vat?: number;
    P_12?: IStawkaPodatku;
    P_12_XII?: number;
    P_12_Zal_15?: 1;
    KwotaAkcyzy?: number;
    GTU?: IGTU;
    Procedura?: IProcedura;
    KursWaluty?: number;
    StanPrzed?: 1;
}

export class FaWiersz {
    constructor(
        public NrWierszaFa: number,
        public UU_ID: string | undefined = undefined,
        public P_6A: string | undefined = undefined,
        public P_7: string | undefined = undefined,
        public Indeks: string | undefined = undefined,
        public GTIN: string | undefined = undefined,
        public PKWiU: string | undefined = undefined,
        public CN: string | undefined = undefined,
        public PKOB: string | undefined = undefined,
        public P_8A: string | undefined = undefined,
        public P_8B: number | undefined = undefined,
        public P_9A: number | undefined = undefined,
        public P_9B: number | undefined = undefined,
        public P_10: number | undefined = undefined,
        public P_11: number | undefined = undefined,
        public P_11A: number | undefined = undefined,
        public P_11Vat: number | undefined = undefined,
        public P_12: StawkaPodatku | undefined = undefined,
        public P_12_XII: number | undefined = undefined,
        public P_12_Zal_15: 1 | undefined = undefined,
        public KwotaAkcyzy: number | undefined = undefined,
        public GTU: GTU | undefined = undefined,
        public Procedura: Procedura | undefined = undefined,
        public KursWaluty: number | undefined = undefined,
        public StanPrzed: 1 | undefined = undefined
    ) {}
}
