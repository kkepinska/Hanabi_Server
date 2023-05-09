import { Card } from "./Card";

export class CardBasic implements Card {
    color: number;
    rank: number;
    colorKnowledge: Array<number>;
    rankKnowledge: Array<number>;
    constructor(color: number, rank: number, numberOfColors: number) {
        this.color = color;
        this.rank = rank;
        this.colorKnowledge = [1, 2, 3, 4, 5];
        this.rankKnowledge = Array.from(Array(numberOfColors).keys()).map(x => x + 1);
    }
}
