import { Hand } from "./Hand";

export class hintStructure{
    type: ("rank" | "color");
    hint: number;
    giver: string;
    receiver: string;
}

export class discardStructure{
    player: string;
    position: number;
}

export class playStructure{
    player: string;
    position: number;
}