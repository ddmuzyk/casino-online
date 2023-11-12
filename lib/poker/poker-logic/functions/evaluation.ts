import { PlayerObject, EvaledHand } from "@/pages/game/poker";
import { SUITS, VALUES } from "../poker";

export const getEvaluation = async(player: PlayerObject, communityCards: Array<string>) => {

  const playerCards: Array<string> = [...player.cards];
  if (!communityCards.length) {
    // Here I have to make a pseudo card so that the server can evaluate the hand (it can't evaluate 2 cards hand)
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    for (let i  = Math.floor(Math.random() * 10); i < VALUES.length; i++) {
      if (VALUES[i] !== playerCards[0][0] && VALUES[i] !== playerCards[1][0]) {
        const card = VALUES[i] + suit;
        playerCards.push(card); 
        break;
      }
    }
  } else {
    playerCards.push(...communityCards);
  }

  const response = await fetch('/api/eval', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cards: playerCards, 
    })
  });
  const data = await response.json();

  return data;
}

export const getArrayOfWinners = (players: Array<PlayerObject>) => {
  // This array will contain the index of the players with the highest hand, there can be more than one if they have the same hand

  const highestHands: Array<number> = [];
  let highestValue = 0;
  for (let player of players) {
    let playersHand = player.evaledHand as EvaledHand;
    if (!player.hasFolded && !player.out && playersHand.value > highestValue) {
      highestValue = playersHand.value;
    }
  }
  for (let i = 0; i < players.length; i++) {
    let playersHand = players[i].evaledHand as EvaledHand;

    if (!players[i].hasFolded && playersHand.value === highestValue) {
      highestHands.push(i);
    }
  }

  return highestHands;
}

export const giveMoneyToWinners = (players: Array<PlayerObject>, winners: Array<number>, pot: number) => {
  const newPlayers = players.map((player) => {
    return {
      ...player,
      cards: [...player.cards],
      evaledHand: {...player.evaledHand as EvaledHand},
      bet: 0,
    }
  });
  const moneyToGive = Math.floor(pot / winners.length);
  console.log('money to give: ',moneyToGive)
  const moneyLeft = pot % winners.length;

  for (let i = 0; i < winners.length; i++) {
    newPlayers[winners[i]].money += moneyToGive;
    newPlayers[winners[i]].won = true;
    newPlayers[winners[i]].action = 'WON';
  }

  if (moneyLeft) {
    // const moneyToGive = Math.floor(moneyLeft / winners.length);
    for (let i = 0; i < winners.length; i++) {
      newPlayers[winners[i]].money += moneyLeft;
    }
  }
  
  return newPlayers;
}

export const getResponse = async (cards: Array<string>) => {
  const response = await fetch('/api/eval', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cards,
    })
  });
  const data = await response.json();

  return data;
}

export const getTheWinner = (players: Array<PlayerObject>) => {
  for (let i = 0; i < players.length; i++) {
    if (!players[i].hasFolded && !players[i].out) return i;
  }
}