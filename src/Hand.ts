import { Card } from "./Card"
import { hintStructure } from "./utils"

export interface Hand {
    cards: Array<Card>;
    getHint(hint: hintStructure): void;
    exchangeCard(position: number, newCard: Card): Card;
}