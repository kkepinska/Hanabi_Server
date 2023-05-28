import _ from "lodash";
import { Card } from "./Card";
import { color } from "./colors"

export class CardBasic implements Card {
    color: color;
    rank: number;
    colorKnowledge: Array<color>;
    rankKnowledge: Array<number>;
    constructor(color: color, rank: number, setOfColors: Set<color>, maxRank: number) {
        this.color = color;
        this.rank = rank;
        this.colorKnowledge = Array.from(setOfColors.values());
        this.rankKnowledge = _.range(1, maxRank + 1);
    }
}
