import { BlokDanych, IBlokDanych } from "./BlokDanych";

export interface IZalacznik {
    BlokDanych: IBlokDanych[];
}

export class Zalacznik {
    constructor(public BlokDanych: BlokDanych[]) {}
}
