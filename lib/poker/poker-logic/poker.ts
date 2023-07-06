// import * as PokerEvaluator from '../../../node_modules/poker-evaluator-ts';

export const SUITS = ["c", "s", "d", "h"]
export const VALUES = [
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

export const cards = SUITS.flatMap((suite) => {
  return VALUES.map((value) => {
    return `${value}${suite}`;
  })
})




export const shuffleCards = (unshuffled: Array<string>) : Array<string>  => {
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
  return deck as Array<string>;
}

export const deck = shuffleCards(cards);

// const player1 = {
//   cards: []
// }

// class Player {
//   cards: Array<string> = [];

//   constructor() {
//   }
// }

// const players = [];

// for (let i = 0; i < 3; i++) {
//   let player = new Player();
//   for (let i = 0; i < 2; i++) {
//     player.cards.push(deck.pop() as string)
//   }
//   players.push(player);
// }

// for (let i = 0; i < 3; i++) {
//   player1.cards.push(deck.pop());
// }
// console.log(players[0])

// console.log(PokerEvaluator.evalHand(player1.cards))