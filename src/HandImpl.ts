import { Card } from "./Card"
import { Hand } from "./Hand"
import { hintStructure } from "./utils"

export class HandImpl implements Hand{
    cards: Array<Card>;
    
    constructor(cards: Array<Card>) {
        this.cards = cards;
    }

    getHint(value: hintStructure): void {
        if (value.type == "color") {
            for (let i of this.cards) {
                if (i.color == value.hint) {
                    i.colorKlowleadge = [i.color]
                } 
                else {
                    i.colorKlowleadge = i.colorKlowleadge.
                        filter(obj => { return obj !== value.hint });
                }
            }
        }

        if (value.type == "rank") {
            for (let i of this.cards) {
                if (i.rank == value.hint) {
                    i.rankKlowleadge = [i.rank]
                } 
                else {
                    i.rankKlowleadge = i.rankKlowleadge.
                        filter(obj => { return obj !== value.hint });
                }
            }
        }
    }

    exchangeCard(position: number, newCard: Card): Card {
        let card = this.cards.at(position);
        this.cards.splice(position, 1);
        this.cards.push(newCard);
        return card;
    }
}
