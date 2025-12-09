export interface IRodzajFaktury {
    Value: "VAT" | "KOR" | "ZAL" | "ROZ" | "UPR" | "KOR_ZAL" | "KOR_ROZ";
}

export class RodzajFaktury {
    constructor(public Value: "VAT" | "KOR" | "ZAL" | "ROZ" | "UPR" | "KOR_ZAL" | "KOR_ROZ") {}
}
