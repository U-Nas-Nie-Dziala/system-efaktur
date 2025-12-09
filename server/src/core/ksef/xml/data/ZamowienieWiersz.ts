import { IStawkaPodatku, StawkaPodatku } from "./StawkaPodatku";
import { GTU, IGTU } from "./GTU";
import { IProcedura, Procedura } from "./Procedura";

export interface IZamowienieWiersz {
    NrWierszaZam: number;
    UU_IDZ?: string;
    P_7Z?: string;
    IndeksZ?: string;
    GTINZ?: string;
    PKWiUZ?: string;
    CNZ?: string;
    PKOBZ?: string;
    P_8AZ?: string;
    P_8BZ?: number;
    P_9AZ?: number;
    P_11NettoZ?: number;
    P_11VatZ?: number;
    P_12Z?: IStawkaPodatku;
    P_12Z_XII?: number;
    P_12Z_Zal_15?: 1;
    GTUZ?: IGTU;
    ProceduraZ?: IProcedura;
    KwotaAkcyzyZ?: number;
    StanPrzedZ?: 1;
}

export class ZamowienieWiersz {
    constructor(
        public NrWierszaZam: number,
        public UU_IDZ?: string,
        public P_7Z?: string,
        public IndeksZ?: string,
        public GTINZ?: string,
        public PKWiUZ?: string,
        public CNZ?: string,
        public PKOBZ?: string,
        public P_8AZ?: string,
        public P_8BZ?: number,
        public P_9AZ?: number,
        public P_11NettoZ?: number,
        public P_11VatZ?: number,
        public P_12Z?: StawkaPodatku,
        public P_12Z_XII?: number,
        public P_12Z_Zal_15?: 1,
        public GTUZ?: GTU,
        public ProceduraZ?: Procedura,
        public KwotaAkcyzyZ?: number,
        public StanPrzedZ?: 1
    ) {}
}
