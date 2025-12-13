import { EmailPU, IEmailPU } from "./EmailPU";
import { ITelefonPU, TelefonPU } from "./TelefonPU";

export interface IDaneKontaktowePU {
    EmailPU?: IEmailPU;
    TelefonPU?: ITelefonPU;
}

export class DaneKontaktowePU {
    constructor(public EmailPU?: EmailPU, public TelefonPU?: TelefonPU) {}
}
