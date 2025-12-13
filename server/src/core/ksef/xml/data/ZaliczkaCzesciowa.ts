import { KursWalutyZ } from "./KursWalutyZ";

export interface IZaliczkaCzesciowa {
    P_6Z: string;
    P_15Z: number;
    KursWalutyZW?: KursWalutyZ;
}

export class ZaliczkaCzesciowa {
    constructor(public P_6Z: string, public P_15Z: number, public KursWalutyZW?: KursWalutyZ) {}
}
