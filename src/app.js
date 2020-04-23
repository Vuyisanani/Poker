"use strict";
var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 0] = "Spades";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Diamonds"] = 3] = "Diamonds";
})(Suit || (Suit = {}));
;
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    get rankName() {
        return Card.rankNames[this.rank - 1];
    }
    get suitName() {
        return Suit[this.suit];
    }
    get name() {
        return this.rankName + ' of ' + this.suitName;
    }
    get imageName() {
        let i, j;
        if (this.rank === 1 || this.rank > 10) {
            j = this.rankName.charAt(0);
        }
        else {
            j = this.rank + '';
        }
        i = this.suitName.charAt(0);
        return j + i + '.svg';
    }
}
//A: Ace, J: Jack, K: King, Q: Queen
Card.rankNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
class Deck {
    constructor() {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 13; j++) {
                this.cards.push(new Card(j, i));
            }
        }
    }
    shuffle() {
        for (let n = this.cards.length; n > 0; n--) {
            let m = Math.floor(Math.random() * n);
            [this.cards[n - 1], this.cards[m]] = [this.cards[m], this.cards[n - 1]];
        }
    }
    draw() {
        return this.cards.shift();
    }
}
;
;
let Ranks = {
    ROYAL_FLUSH: {
        name: 'Royal Flush',
        payout: 800,
    },
    STRAIGHT_FLUSH: {
        name: 'Straight Flush',
        payout: 50,
    },
    FOUR_OF_A_KIND: {
        name: 'Four of a Kind',
        payout: 25,
    },
    FULL_HOUSE: {
        name: 'Full House',
        payout: 9,
    },
    FLUSH: {
        name: 'Flush',
        payout: 6,
    },
    STRAIGHT: {
        name: 'Straight',
        payout: 4,
    },
    THREE_OF_A_KIND: {
        name: 'Three of a Kind',
        payout: 3,
    },
    TWO_PAIR: {
        name: 'Two Pair',
        payout: 2,
    },
    JACKS_OR_BETTER: {
        name: 'Jacks or Better',
        payout: 1,
    },
    NOTHING: {
        name: 'Nothing',
        payout: 0,
    },
};
;
class Kinds {
    constructor(cards) {
        this.kinds = {};
        cards.forEach(c => {
            let r = c.rank;
            if (this.kinds[r] === undefined)
                this.kinds[r] = [];
            this.kinds[r].push(c);
        });
    }
    has(numOfKinds) {
        let kg = this.all(numOfKinds);
        if (kg)
            return kg[0];
        return false;
    }
    all(numOfKinds) {
        let result = [];
        //To Do: 
        for (let rank in Object.keys(this.kinds)) {
            if (this.kinds[rank].length === numOfKinds) {
                result.push({
                    cards: this.kinds[rank],
                    rank: +rank,
                });
            }
        }
        if (result.length === 0)
            return false;
        return result;
    }
}
class Hand {
    constructor(cards) {
        if (cards !== undefined) {
            this.cards = cards;
        }
        else {
            this.cards = [];
        }
    }
    isFlush() {
        let suit = this.cards[0].suit;
        return this.cards.every(c => c.suit === suit);
    }
    isStraight() {
        return this.isAceHighStraight() || this.isAceLowStraight();
    }
    isAceHighStraight() {
        let high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;
            if (r === 1)
                r = 14;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    }
    isAceLowStraight() {
        let high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    }
    has(...ranks) {
        return this.cards.some(c => {
            let r = c.rank, i = ranks.indexOf(r);
            if (i !== -1) {
                ranks.splice(i, 1);
            }
            return ranks.length === 0;
        });
    }
    getScore() {
        if (this.isFlush() && this.isStraight()) {
            if (this.has(1, 10, 11, 12, 13)) {
                return {
                    rank: Ranks.ROYAL_FLUSH,
                    scoringCards: this.cards,
                };
            }
            return {
                rank: Ranks.STRAIGHT_FLUSH,
                scoringCards: this.cards,
            };
        }
        let kinds = new Kinds(this.cards);
        let has4 = kinds.has(4);
        if (has4) {
            return {
                rank: Ranks.FOUR_OF_A_KIND,
                scoringCards: has4.cards,
            };
        }
        let has3 = kinds.has(3), has2 = kinds.has(2);
        if (has3 && has2) {
            return {
                rank: Ranks.FULL_HOUSE,
                scoringCards: this.cards,
            };
        }
        if (this.isFlush()) {
            return {
                rank: Ranks.FLUSH,
                scoringCards: this.cards,
            };
        }
        if (this.isStraight()) {
            return {
                rank: Ranks.STRAIGHT,
                scoringCards: this.cards,
            };
        }
        if (has3) {
            return {
                rank: Ranks.THREE_OF_A_KIND,
                scoringCards: has3.cards,
            };
        }
        let all2 = kinds.all(2);
        if (all2 && all2.length === 2) {
            return {
                rank: Ranks.TWO_PAIR,
                scoringCards: (() => {
                    let cards = [];
                    all2.forEach(kg => {
                        cards = cards.concat(kg.cards);
                    });
                    return cards;
                })(),
            };
        }
        if (has2 && (has2.rank >= 11 || has2.rank === 1)) {
            return {
                rank: Ranks.JACKS_OR_BETTER,
                scoringCards: has2.cards,
            };
        }
        return {
            rank: Ranks.NOTHING,
            scoringCards: [],
        };
    }
}
class Round {
    constructor(bet) {
        this.bet = bet;
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }
    draw() {
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
    }
}
class UI {
    constructor(parent) {
        this.parent = parent;
        this.cashDisplay = parent.querySelector('.cash');
        this.betInput = parent.querySelector('.bet-input');
        this.betButton = parent.querySelector('.bet-button');
        this.playButton = parent.querySelector('.play-button');
        this.resetButton = parent.querySelector('.reset-button');
        this.cardsListElement = parent.querySelector('.cards');
        this.msg = parent.querySelector('.msg');
        this._cards = new Map();
    }
    betMode() {
        this.betInput.disabled = false;
        this.betButton.disabled = false;
        this.playButton.disabled = true;
        this.resetButton.disabled = true;
    }
    playMode() {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = false;
        this.resetButton.disabled = true;
    }
    gameOverMode() {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = true;
        this.resetButton.disabled = false;
    }
    enableCards() {
        this.cards.forEach((c) => {
            c.disabled = false;
        });
    }
    disableCards() {
        this.cards.forEach((c) => {
            c.disabled = true;
        });
    }
    updateCash(cash) {
        this.cashDisplay.textContent = '$' + cash;
    }
    get cards() {
        return this._cards;
    }
    addCard(card) {
        let u = new UICard(card);
        this._cards.set(card, u);
        this.cardsListElement.appendChild(u.element);
        return u;
    }
    replaceCard(newCard, oldCard) {
        let oldUICard = this._cards.get(oldCard);
        if (oldUICard === undefined)
            throw 'Card not in display';
        let u = new UICard(newCard);
        this.cardsListElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);
        return u;
    }
    clearCards() {
        this._cards = new Map();
        while (this.cardsListElement.firstChild) {
            this.cardsListElement.removeChild(this.cardsListElement.firstChild);
        }
    }
}
class UICard {
    constructor(card) {
        this.element = document.createElement('div');
        this.img = document.createElement('img');
        this.disabled = false;
        this._discarded = false;
        this._highlighted = false;
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;
        this.element.addEventListener('click', () => {
            if (!this.disabled)
                this.discarded = !this.discarded;
        });
    }
    get discarded() {
        return this._discarded;
    }
    get highlighted() {
        return this._highlighted;
    }
    set discarded(value) {
        this._discarded = value;
        this.element.classList.toggle('discarded', this.discarded);
    }
    set highlighted(value) {
        this._highlighted = value;
        this.element.classList.toggle('highlighted', this.highlighted);
    }
}
let ui = new UI(document.querySelector('main')), round, player = {
    cash: 100,
};
function init() {
    reset();
    ui.betButton.addEventListener('click', () => {
        let bet = parseInt(ui.betInput.value);
        if (bet > player.cash && bet <= 0)
            return;
        round = new Round(bet);
        round.draw();
        player.cash -= bet;
        updateCash();
        round.hand.cards.forEach(c => {
            ui.addCard(c);
        });
        ui.playMode();
        msg('Click on the cards you wish to discard');
    });
    ui.playButton.addEventListener('click', () => {
        round.hand.cards.forEach((c, i) => {
            let u = ui.cards.get(c);
            if (u.discarded) {
                let newCard = round.deck.draw();
                round.hand.cards[i] = newCard;
                ui.replaceCard(newCard, c);
            }
        });
        let score = round.hand.getScore(), payout = score.rank.payout * round.bet;
        player.cash += payout;
        updateCash();
        score.scoringCards.forEach(c => {
            ui.cards.get(c).highlighted = true;
        });
        ui.gameOverMode();
        ui.disableCards();
        msg('Hand: ' + score.rank.name + '<br>Winnings: $' + payout);
    });
    ui.resetButton.addEventListener('click', () => {
        reset();
    });
}
let reset = () => {
    ui.betMode();
    ui.clearCards();
    ui.enableCards();
    clearMsg();
};
let updateCash = () => {
    ui.updateCash(player.cash);
};
const msg = (str) => {
    ui.msg.innerHTML += str + '<br>';
};
let clearMsg = () => {
    ui.msg.innerHTML = '';
};
init();
//# sourceMappingURL=app.js.map