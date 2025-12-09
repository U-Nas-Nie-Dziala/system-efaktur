export interface IKodWaluty {
    Value: "PLN" | "EUR" | "USD";
}

export class KodWaluty {
    constructor(public Value: "PLN" | "EUR" | "USD") {}
}
