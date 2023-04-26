import { GameInfo } from "./GameInfo"
import { Card } from "./Card"
import { Hand } from "./Hand"
import { Gamestate } from "./Gamestate";
import { hintStructure, discardStructure, playStructure} from "./utils"
import { HandImpl } from "./HandImpl";
import { CardBasic } from "./CardBasic";

class basicDeck {
    static createDeck(numberOfColors: number): Array<Card> {
        let deck: Array<Card> = [];
        for (let i = 1; i <= numberOfColors; i++) {
            deck.push(new CardBasic(i, 1, numberOfColors));
            deck.push(new CardBasic(i, 1, numberOfColors));
            deck.push(new CardBasic(i, 1, numberOfColors));
            deck.push(new CardBasic(i, 2, numberOfColors));
            deck.push(new CardBasic(i, 2, numberOfColors));
            deck.push(new CardBasic(i, 3, numberOfColors));
            deck.push(new CardBasic(i, 3, numberOfColors));
            deck.push(new CardBasic(i, 4, numberOfColors));
            deck.push(new CardBasic(i, 4, numberOfColors));
            deck.push(new CardBasic(i, 1, numberOfColors));
        }
        deck = deck.sort(function () { return Math.random() - 0.5; });
        return deck;
    }
}


export class Game implements Gamestate{
    gameInfo: GameInfo;
    hands: Array<Hand>;
    deck: Array<Card>;
    discard: Array<Card>;
    availableHints: number;
    currentScore: Array<number>;
    lifeTokens: number;

    constructor(numberOfPlayers: number, numberOfColors: number) {
        this.gameInfo = {
            maxHints: 8,
            handSize: 4,
            numberOfPlayers: numberOfPlayers,
            numberOfColors: numberOfColors,
        }
        this.deck = basicDeck.createDeck(numberOfColors);
        this.hands = []
        for (let i =0; i < numberOfPlayers; i++) {
            this.hands.push(new HandImpl(this.deck.splice(this.deck.length - this.gameInfo.handSize, this.gameInfo.handSize)));
        }
        this.discard = [];
        this.availableHints = this.gameInfo.maxHints;
        this.currentScore = new Array<number>(this.gameInfo.numberOfColors).fill(0);
        this.lifeTokens = 3;
    }

    hintAction(value: hintStructure) : boolean {
        if (this.availableHints == 0) {
            return false;
        }
        this.availableHints -= 1;
        this.hands.at(value.receiver).getHint(value);
        return true;
    }

    discardAction(value: discardStructure) : boolean {
        if (this.availableHints == this.gameInfo.maxHints) {
            return false;
        }
        this.availableHints += 1;
        this.discard.push(this.hands.at(value.player).exchangeCard(value.position, this.deck.pop()));
        return true;
    }

    playAction(value: playStructure) : boolean {
        let playedCard = this.hands.at(value.player).exchangeCard(value.position, this.deck.pop());
        if(this.currentScore.at(playedCard.color) == playedCard.rank -1 ){
            this.currentScore[playedCard.color] += 1;
        }
        else {
            this.lifeTokens -= 1;
            this.discard.push(playedCard);
        }
        return true;
    }
}