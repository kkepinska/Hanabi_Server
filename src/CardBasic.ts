import { Card } from "./Card";
import { color } from "./colors"

export class CardBasic implements Card {
    color: color;
    rank: number;
    colorKnowledge: Array<color>;
    rankKnowledge: Array<number>;
    constructor(color: color, rank: number, setOfColors: Set<color>) {
        this.color = color;
        this.rank = rank;
        this.colorKnowledge = Array.from(setOfColors.values());
        this.rankKnowledge = Array.from(Array(setOfColors.size).keys()).map(x => x + 1);
    }
}
