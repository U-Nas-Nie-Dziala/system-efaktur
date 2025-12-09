export interface IKodFormularza {
    Value: string;
}

export class KodFormularza {
    public readonly _attributes: [string, string][] = [
        ["kodSystemowy", "FA (3)"],
        ["wersjaSchemy", "1-0E"],
    ];

    public Value: string = "FA";

    constructor() {}
}
