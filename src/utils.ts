import { Card } from "./Card";
import { Hand } from "./Hand";

export class hintStructure implements action {
    player: string;
    receiver: string;
    type: ("rank" | "color");
    value: number;
    actionType: "hint" = "hint";
}

export class discardStructure implements action {
    player: string;
    position: number;
    card?: Card;
    actionType: "discard" = "discard";
}

export class playStructure implements action {
    player: string;
    position: number;
    card?: Card;
    actionType: "play" = "play";
}

export interface action {
    player: string;
    actionType: ("hint" | "discard" | "play");
}
