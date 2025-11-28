import { EmailPU } from "./EmailPU";
import { TelefonPU } from "./TelefonPU";

export class DaneKontaktowePU {
    constructor(public EmailPU?: EmailPU, public TelefonPU?: TelefonPU) {}
}
