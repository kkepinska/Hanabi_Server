import { Card } from "./Card";

export class CardBasic implements Card {
    color: number;
    rank: number;
    colorKlowleadge: Array<number>;
    rankKlowleadge: Array<number>;
    constructor(color: number, rank: number, numberOfColors: number) {
        this.color = color;
        this.rank = rank;
        this.colorKlowleadge = [1, 2, 3, 4, 5];
        this.rankKlowleadge = Array.from(Array(numberOfColors).keys()).map(x => x + 1);
    }
}
