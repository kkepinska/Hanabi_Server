import { Hand } from "./Hand";

export class hintStructure{
    type: string;
    hint: number;
    giver: number;
    receiver: number;
}

export class discardStructure{
    player: number;
    position: number;
}

export class playStructure{
    player: number;
    position: number;
}