// let test = new Deck();

// test.shuffle();

// console.log(test.draw().name);

let h = new Hand([
    new Card(3, Suit.Diamonds),
    new Card(5, Suit.Diamonds),
    new Card(6, Suit.Diamonds),
]);

console.log(h.has(5));
console.log(h.has(6));
console.log(h.has(7));



