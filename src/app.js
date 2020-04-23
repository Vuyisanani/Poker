"use strict";
var Suit;
(function (Suit) {
    Suit[Suit["Spades"] = 0] = "Spades";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Diamonds"] = 3] = "Diamonds";
})(Suit || (Suit = {}));
;
var Card = /** @class */ (function () {
    function Card(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    Object.defineProperty(Card.prototype, "rankName", {
        get: function () {
            return Card.rankNames[this.rank - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "suitName", {
        get: function () {
            return Suit[this.suit];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "name", {
        get: function () {
            return this.rankName + ' of ' + this.suitName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "imageName", {
        get: function () {
            var i, j;
            if (this.rank === 1 || this.rank > 10) {
                j = this.rankName.charAt(0);
            }
            else {
                j = this.rank + '';
            }
            i = this.suitName.charAt(0);
            return j + i + '.svg';
        },
        enumerable: true,
        configurable: true
    });
    //A: Ace, J: Jack, K: King, Q: Queen
    Card.rankNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck() {
        this.cards = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j <= 13; j++) {
                this.cards.push(new Card(j, i));
            }
        }
    }
    Deck.prototype.shuffle = function () {
        var _a;
        for (var n = this.cards.length; n > 0; n--) {
            var m = Math.floor(Math.random() * n);
            _a = [this.cards[m], this.cards[n - 1]], this.cards[n - 1] = _a[0], this.cards[m] = _a[1];
        }
    };
    Deck.prototype.draw = function () {
        return this.cards.shift();
    };
    return Deck;
}());
;
;
var Ranks = {
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
var Kinds = /** @class */ (function () {
    function Kinds(cards) {
        var _this = this;
        this.kinds = {};
        cards.forEach(function (c) {
            var r = c.rank;
            if (_this.kinds[r] === undefined)
                _this.kinds[r] = [];
            _this.kinds[r].push(c);
        });
    }
    Kinds.prototype.has = function (numOfKinds) {
        var kg = this.all(numOfKinds);
        if (kg)
            return kg[0];
        return false;
    };
    Kinds.prototype.all = function (numOfKinds) {
        var result = [];
        // To Do:
        for (var rank in Object.keys(this.kinds)) {
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
    };
    return Kinds;
}());
var Hand = /** @class */ (function () {
    function Hand(cards) {
        if (cards !== undefined) {
            this.cards = cards;
        }
        else {
            this.cards = [];
        }
    }
    Hand.prototype.isFlush = function () {
        var suit = this.cards[0].suit;
        return this.cards.every(function (c) { return c.suit === suit; });
    };
    Hand.prototype.isStraight = function () {
        return this.isAceHighStraight() || this.isAceLowStraight();
    };
    Hand.prototype.isAceHighStraight = function () {
        var high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            var r = c.rank;
            if (r === 1)
                r = 14;
            //Checking if there are duplicates
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    };
    Hand.prototype.isAceLowStraight = function () {
        var high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            var r = c.rank;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        // Difference between the cards if 4 , we have 5 cards
        return high - low === 4;
    };
    Hand.prototype.has = function () {
        var ranks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ranks[_i] = arguments[_i];
        }
        return this.cards.some(function (c) {
            var r = c.rank, i = ranks.indexOf(r);
            if (i !== -1) {
                ranks.splice(i, 1);
            }
            return ranks.length === 0;
        });
    };
    Hand.prototype.getScore = function () {
        if (this.isFlush() && this.isStraight()) {
            if (this.has(1, 10, 11, 12, 13)) {
                // Royal flush
                return {
                    rank: Ranks.ROYAL_FLUSH,
                    scoringCards: this.cards,
                };
            }
            // Straight flush
            return {
                rank: Ranks.STRAIGHT_FLUSH,
                scoringCards: this.cards,
            };
        }
        var kinds = new Kinds(this.cards);
        var has4 = kinds.has(4);
        if (has4) {
            return {
                rank: Ranks.FOUR_OF_A_KIND,
                scoringCards: has4.cards,
            };
        }
        var has3 = kinds.has(3), has2 = kinds.has(2);
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
        var all2 = kinds.all(2);
        if (all2 && all2.length === 2) {
            return {
                rank: Ranks.TWO_PAIR,
                scoringCards: (function () {
                    var cards = [];
                    all2.forEach(function (kg) {
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
    };
    return Hand;
}());
var Round = /** @class */ (function () {
    function Round(bet) {
        this.bet = bet;
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }
    Round.prototype.draw = function () {
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
    };
    return Round;
}());
// let test = new Deck();
// test.shuffle();
// console.log(test.draw().name);
var h = new Hand([
    new Card(3, Suit.Diamonds),
    new Card(5, Suit.Diamonds),
    new Card(6, Suit.Diamonds),
]);
console.log(h.has(5));
console.log(h.has(6));
console.log(h.has(7));
//# sourceMappingURL=app.js.map