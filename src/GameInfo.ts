import { color } from "./colors"

export interface GameInfo {
    maxHints: number;
    handSize: number;
    numberOfPlayers: number;
    setOfColors: Array<color>;
    raindbowCritical: boolean;
    blackCritical: boolean;
}