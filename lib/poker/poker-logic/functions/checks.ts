import { Stage, PlayerObject, NumOrNull, EvaledHand } from "@/pages/game/poker";

export const checkIfOnePlayerLeft = (players: Array<PlayerObject>) => {
  let brokePlayers = 0;
  for (let player of players) {
    if (player.money === 0) brokePlayers++;
  }

  return brokePlayers === players.length - 1;    
}

export const checkIfUserLoses = (players: Array<PlayerObject>) => {
  return players[0].money === 0;
}



export const checkIfCardsShouldBeDealt = (
  turn: number, 
  stage: Stage, 
  tableMoney: number,
  playerWithBiggestBet: NumOrNull,
  playerThatBegins: number,
  players: Array<PlayerObject>
  ) => {
    return (turn === playerWithBiggestBet || (!tableMoney && turn === playerThatBegins));
}

const checkForDuplicates = (deck: Array<string>, players: Array<PlayerObject>) => {
  const newDeck = [...deck];
  const newPlayers = players.map((player) => {
    return {
      ...player,
      cards: [...player.cards],
      evaledHand: {...player.evaledHand as EvaledHand}
    }
  });
  for (let player of newPlayers) {
    for (let card of player.cards) {
      if (newDeck.includes(card)) {
        console.log('duplicate found: ', card);
        return true;
      }
    }
  }
  return false;
}

export const checkForCalls = (players: Array<PlayerObject>) => {
  let biggestBet = 0;
  for (let player of players) {
    if (player.bet > biggestBet) biggestBet = player.bet;
  }

  // let possibleCalls = 0;
  for (let player of players) { 
    if (player.money > 0 && player.bet < biggestBet) return true;
  }

  return false;
}