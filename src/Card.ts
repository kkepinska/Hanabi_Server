import { color } from "./colors"

export interface Card {
    color: color;
    rank: number;
    colorKnowledge: Array<color>;
    rankKnowledge: Array<number>;
}