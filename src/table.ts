import { GameInfo } from "./GameInfo"
import { Card } from "./Card"
import { Hand } from "./Hand"
import { Gamestate } from "./Gamestate";
import { hintStructure, discardStructure, playStructure, action} from "./utils"
import { HandImpl } from "./HandImpl";
import { CardBasic } from "./CardBasic";
import { color } from "./colors"

class basicDeck {
    static createDeck(setOfColors: Set<color>, maxRank: number, raindbowCritical: boolean, blackCritical: boolean): Array<Card> {
        let deck: Array<Card> = []; 
        if (raindbowCritical) {
            deck.push(new CardBasic(color.RAINDBOW, 1, setOfColors, maxRank));
            deck.push(new CardBasic(color.RAINDBOW, 2, setOfColors, maxRank));
            deck.push(new CardBasic(color.RAINDBOW, 3, setOfColors, maxRank));
            deck.push(new CardBasic(color.RAINDBOW, 4, setOfColors, maxRank));
            deck.push(new CardBasic(color.RAINDBOW, 5, setOfColors, maxRank));
            setOfColors.delete(color.RAINDBOW);
        }

        if (blackCritical) {
            deck.push(new CardBasic(color.BLACK, 1, setOfColors, maxRank));
            deck.push(new CardBasic(color.BLACK, 2, setOfColors, maxRank));
            deck.push(new CardBasic(color.BLACK, 3, setOfColors, maxRank));
            deck.push(new CardBasic(color.BLACK, 4, setOfColors, maxRank));
            deck.push(new CardBasic(color.BLACK, 5, setOfColors, maxRank));
            setOfColors.delete(color.BLACK);
        }

        for (let i of setOfColors) {
            deck.push(new CardBasic(i, 1, setOfColors, maxRank));
            deck.push(new CardBasic(i, 1, setOfColors, maxRank));
            deck.push(new CardBasic(i, 1, setOfColors, maxRank));
            deck.push(new CardBasic(i, 2, setOfColors, maxRank));
            deck.push(new CardBasic(i, 2, setOfColors, maxRank));
            deck.push(new CardBasic(i, 3, setOfColors, maxRank));
            deck.push(new CardBasic(i, 3, setOfColors, maxRank));
            deck.push(new CardBasic(i, 4, setOfColors, maxRank));
            deck.push(new CardBasic(i, 4, setOfColors, maxRank));
            deck.push(new CardBasic(i, 5, setOfColors, maxRank));
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
    private currentPlayerIdx: number;
    history: action[];

    constructor(players: Array<string>, mode: string = "basic") {
        //TODO
        if(mode == "basic")
            this.gameInfo = {
                maxHints: 8,
                handSize: 4,
                numberOfPlayers: players.length,
                setOfColors: new Set<color>([1, 2, 3, 4, 5]),
                raindbowCritical: false,
                blackCritical: false,
            }
        this.deck = basicDeck.createDeck(this.gameInfo.setOfColors, 5, this.gameInfo.raindbowCritical, this.gameInfo.blackCritical);
        this.hands = new Map<string, Hand>()
        for (let player of players) {
            this.hands.set(player, new HandImpl(this.deck.splice(this.deck.length - this.gameInfo.handSize, this.gameInfo.handSize)));
        }
        this.discard = [];
        this.availableHints = this.gameInfo.maxHints;
        this.currentScore = new Array<number>(this.gameInfo.setOfColors.size).fill(0);
        this.lifeTokens = 3;
        this.players = players;
        this.currentPlayerIdx = 0;
        this.currentPlayer = players[this.currentPlayerIdx];
        this.history = new Array<action>();
    }

    hintAction(value: hintStructure) : boolean {
        if (value.player != this.currentPlayer || this.availableHints == 0) {
            return false;
        }
        this.availableHints -= 1;
        this.hands.get(value.receiver).getHint(value);
        this.setNextPlayer();
        this.history.push(value);
        return true;
    }

    discardAction(value: discardStructure) : boolean {
        if (value.player != this.currentPlayer || this.availableHints == this.gameInfo.maxHints) {
            return false;
        }
        this.availableHints += 1;
        value.card = this.hands.get(value.player).exchangeCard(value.position, this.deck.pop())
        this.discard.push(value.card);
        this.setNextPlayer();
        this.history.push(value);
        return true;
    }

    playAction(value: playStructure) : boolean {
        if (value.player != this.currentPlayer) {
            return false;
        }
        let playedCard = this.hands.get(value.player).exchangeCard(value.position, this.deck.pop());
        if(this.currentScore.at(playedCard.color-1) == playedCard.rank -1 ){
            this.currentScore[playedCard.color-1] += 1;
        }
        else {
            this.lifeTokens -= 1;
            this.discard.push(playedCard);
        }
        value.card = playedCard;
        this.history.push(value)
        this.setNextPlayer();
        return true;
    }

    setNextPlayer() {
        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length
        this.currentPlayer = this.players[this.currentPlayerIdx]
    }
}