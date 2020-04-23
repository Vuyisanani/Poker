enum Suit {
    Spades,
    Clubs,
    Hearts,
    Diamonds,
};

class Card {
    public readonly rank: number;
    public readonly suit: number;
    
    public constructor(rank: number, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
    }
    //A: Ace, J: Jack, K: King, Q: Queen
    private static rankNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    public get rankName(): string {
        
        return Card.rankNames[this.rank - 1];
    }

    public get suitName(): string {
        return Suit[this.suit];
    }
    
    public get name(): string {
        return this.rankName + ' of ' + this.suitName;
    }

    public get imageName(): string {
        let i: string, j: string;

        if(this.rank === 1 || this.rank > 10) {
            j = this.rankName.charAt(0);
        }else {
            j = this.rank + '';
        }

        i = this.suitName.charAt(0);

        return j + i + '.svg';
    }
}