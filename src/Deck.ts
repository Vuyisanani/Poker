class Deck {
    private cards: Card[];

    public constructor() {
        this.cards = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= 13; j++) {
                this.cards.push(new Card(j, i));
            }
        }
    }

    public shuffle(): void {
        for (let n = this.cards.length; n > 0; n--) {
            let m = Math.floor(Math.random() * n);
            [this.cards[n - 1], this.cards[m]] = [this.cards[m], this.cards[n - 1]];
        }
    }
    public draw(): Card {
        return <Card > this.cards.shift();
    }
}