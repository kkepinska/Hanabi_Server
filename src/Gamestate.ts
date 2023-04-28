import { GameInfo } from "./GameInfo"
import { Card } from "./Card"
import { Hand } from "./Hand"
import { discardStructure, hintStructure, playStructure } from "./utils";

export interface Gamestate {
    gameInfo: GameInfo;
    hands: Array<Hand>;
    deck: Array<Card>;
    discard: Array<Card>;
    availableHints: number;
    currentScore: Array<number>;
    lifeTokens: number;
    playAction(value: playStructure) : boolean;
    discardAction(value: discardStructure) : boolean;
    hintAction(value: hintStructure) : boolean;
}