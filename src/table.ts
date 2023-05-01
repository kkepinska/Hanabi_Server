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
    hands: Map<string, Hand>;
    deck: Array<Card>;
    discard: Array<Card>;
    availableHints: number;
    currentScore: Array<number>;
    lifeTokens: number;
    players: Array<string>;
    currentPlayer: string;
    currentPlayerIdx: number;

    constructor(players: Array<string>, numberOfColors: number) {
        this.gameInfo = {
            maxHints: 8,
            handSize: 4,
            numberOfPlayers: players.length,
            numberOfColors: numberOfColors,
        }
        this.deck = basicDeck.createDeck(numberOfColors);
        this.hands = new Map<string, Hand>()
        for (let player of players) {
            this.hands.set(player, new HandImpl(this.deck.splice(this.deck.length - this.gameInfo.handSize, this.gameInfo.handSize)));
        }
        this.discard = [];
        this.availableHints = this.gameInfo.maxHints;
        this.currentScore = new Array<number>(this.gameInfo.numberOfColors).fill(0);
        this.lifeTokens = 3;
        this.players = players;
        this.currentPlayerIdx = 0;
        this.currentPlayer = players[this.currentPlayerIdx];
    }

    hintAction(value: hintStructure) : boolean {
        if (value.giver != this.currentPlayer || this.availableHints == 0) {
            return false;
        }
        this.availableHints -= 1;
        this.hands.get(value.receiver).getHint(value);
        this.setNextPlayer();
        return true;
    }

    discardAction(value: discardStructure) : boolean {
        if (value.player != this.currentPlayer || this.availableHints == this.gameInfo.maxHints) {
            return false;
        }
        this.availableHints += 1;
        this.discard.push(this.hands.get(value.player).exchangeCard(value.position, this.deck.pop()));
        this.setNextPlayer();
        return true;
    }

    playAction(value: playStructure) : boolean {
        if (value.player != this.currentPlayer) {
            return false;
        }
        let playedCard = this.hands.get(value.player).exchangeCard(value.position, this.deck.pop());
        if(this.currentScore.at(playedCard.color) == playedCard.rank -1 ){
            this.currentScore[playedCard.color] += 1;
        }
        else {
            this.lifeTokens -= 1;
            this.discard.push(playedCard);
        }
        this.setNextPlayer();
        return true;
    }

    setNextPlayer() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length
        this.currentPlayer = this.players[this.currentPlayerIdx]
    }
}