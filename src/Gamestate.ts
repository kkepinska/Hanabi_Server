import { GameInfo } from "./GameInfo"
import { Card } from "./Card"
import { Hand } from "./Hand"
import { action, discardStructure, hintStructure, playStructure } from "./utils";

export interface Gamestate {
    gameInfo: GameInfo;
    hands: Map<string, Hand>;
    deck: Array<Card>;
    discard: Array<Card>;
    availableHints: number;
    currentScore: Array<number>;
    lifeTokens: number;
    currentPlayer: string;
    history: Array<action>;
    playAction(value: playStructure) : boolean;
    discardAction(value: discardStructure) : boolean;
    hintAction(value: hintStructure) : boolean;
}