import { Stage, PlayerObject, NumOrNull, EvaledHand } from "@/pages/game/poker";

// export const checkIfOnePlayerLeft = (players: Array<PlayerObject>) => {
//   let brokePlayers = 0;
//   for (let player of players) {
//     if (player.money === 0) brokePlayers++;
//   }

//   return brokePlayers === players.length - 1;    
// }

export const checkIfUserLoses = (player: PlayerObject) => {
  return player.out;
}

export const checkIfUserWins = (players: Array<PlayerObject>) => {
  return checkIfThereIsAWinner(players) && !players[0].hasFolded && !players[0].out;
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

export const checkForPossibleAction = (players: Array<PlayerObject>) => {

  let possibleBets = 0

  for (let player of players) {
    if (!player.hasFolded && player.money > 0 && !player.out) possibleBets++;
  }

  return possibleBets > 1;
}

export const checkForFolds = (players: Array<PlayerObject>) => {
  let folds = 0;
  for (let player of players) {
    if (player.hasFolded) folds++;
  }

  return folds === players.length - 1;
}

export const getNumberOfPlayersInGame = (players: Array<PlayerObject>) => {
  let activePlayers = 0;
  for (let player of players) {
    if (!player.out) activePlayers++;
  }

  return activePlayers;
}

export const getNumberOfActivePlayers = (players: Array<PlayerObject>) => {
  let activePlayers = players.length;
  for (let player of players) {
    if (player.hasFolded || player.out) activePlayers--;
  }

  return activePlayers;
}

export const checkIfThereIsAWinner = (players: Array<PlayerObject>) => {
  return getNumberOfActivePlayers(players) === 1;
}