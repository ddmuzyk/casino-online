import { PlayerObject } from "@/pages/game/poker";

export const getNextTurn = (turn: number, players: Array<PlayerObject>) => {
  let newTurn = turn === players.length - 1 ? 0 : turn + 1;

  // Added a temporary counter to avoid infinite loops
  let productionCounter = 0;

  while ((players[newTurn].out || players[newTurn]?.hasFolded || (players[newTurn]?.money === 0 && players[newTurn].bet === 0)) && productionCounter < 5) {
    
    newTurn = newTurn === players.length - 1 ? 0 : newTurn + 1;
    productionCounter++;
  }

  return newTurn;
}

export const getPreviousTurn = (turn: number, players: Array<PlayerObject>) => {
  let newTurn = turn === 0 ? players.length - 1 : turn - 1;

  let productionCounter = 0;

  while ((players[newTurn].out || players[newTurn]?.hasFolded || players[newTurn]?.money === 0) && productionCounter < 5) {
    newTurn = newTurn === 0 ? players.length - 1 : newTurn - 1;
  }

  return newTurn;
}