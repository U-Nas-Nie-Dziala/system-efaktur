import { StawkaPodatku } from "./StawkaPodatku";
import { GTU } from "./GTU";
import { Procedura } from "./Procedura";

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
