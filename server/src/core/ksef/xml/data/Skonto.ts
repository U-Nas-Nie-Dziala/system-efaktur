export interface ISkonto {
    WarunkiSkonta: string;
    WysokoscSkonta: string;
}

export class Skonto {
    constructor(public WarunkiSkonta: string, public WysokoscSkonta: string) {}
}
