// const PokerEvaluator = require('poker-evaluator');


const SUITS = ["c", "s", "d", "h"]
const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A"
]

const cards = SUITS.flatMap((suite) => {
  return VALUES.map((value) => {
    return `${value}${suite}`;
  })
})




const shuffleCards = (unshuffled) => {
  let cards = [...unshuffled];
  const deck = [];
  while (cards.length) {
    let i = Math.floor(Math.random() * cards.length);
    if (cards.length === 1) {
      deck.push(cards.pop());
    } else {
      let temp = cards[cards.length-1];
      cards[cards.length-1] = cards[i];
      cards[i] = temp;
      deck.push(cards.pop());
    }
  }
  return deck;
}

const deck = shuffleCards(cards);

// const player1 = {
//   cards: []
// }

class Player {
  constructor() {
    this.cards = [];
  }
}

const players = [];

for (let i = 0; i < 3; i++) {
  let player = new Player();
  for (let i = 0; i < 2; i++) {
    player.cards.push(deck.pop())
  }
  players.push(player);
}

// for (let i = 0; i < 3; i++) {
//   player1.cards.push(deck.pop());
// }
console.log(players[0])

// console.log(PokerEvaluator.evalHand(player1.cards))