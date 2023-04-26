import { GameInfo } from "./GameInfo"
import { Card } from "./Card"
import { Hand } from "./Hand"

export interface Gamestate {
    gameInfo: GameInfo;
    hands: Array<Hand>;
    deck: Array<Card>;
    discard: Array<Card>;
    availableHints: number;
    currentScore: Array<number>;
    lifeTokens: number;
}