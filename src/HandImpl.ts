import { Card } from "./Card"
import { Hand } from "./Hand"
import { hintStructure } from "./utils"
import { color } from "./colors"

export class HandImpl implements Hand{
    cards: Array<Card>;
    
    constructor(cards: Array<Card>) {
        this.cards = cards;
    }

    getHint(hint: hintStructure): void {
        if (hint.type === "color") {
            for (let card of this.cards) {
                if (card.color === hint.value || card.color == color.RAINBOW) {
                    card.colorKnowledge = card.colorKnowledge.
                    filter(col => (col == hint.value || col == color.RAINBOW));
                } else {
                    card.colorKnowledge = card.colorKnowledge.
                        filter(col => (col !== hint.value && col !== color.RAINBOW));
                }
            }
        }

        if (hint.type === "rank") {
            for (let card of this.cards) {
                if (card.rank === hint.value) {
                    card.rankKnowledge = [card.rank]
                } else {
                    card.rankKnowledge = card.rankKnowledge.
                        filter(rank => (rank !== hint.value));
                }
            }
        }
    }

    exchangeCard(position: number, newCard: Card): Card {
        let card = this.cards.at(position);
        this.cards.splice(position, 1);
        if ( newCard != null)
            this.cards.push(newCard);
        return card;
    }
}
