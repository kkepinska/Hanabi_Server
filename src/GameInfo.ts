import { color } from "./colors"

export interface GameInfo {
    maxHints: number;
    handSize: number;
    numberOfPlayers: number;
    setOfColors: Set<color>;
    raindbowCritical: boolean;
    blackCritical: boolean;
}