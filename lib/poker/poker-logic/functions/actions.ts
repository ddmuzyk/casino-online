import { PlayerObject, EvaledHand, NumOrNull, Stage } from "@/pages/game/poker";

export const check = (turn: number, players: Array<PlayerObject>, playerWithBiggestBet: NumOrNull, stage: Stage) => {

  const newPlayers = players.map((player) => {
    return {
      ...player,
      cards: [...player.cards],
      evaledHand: {...player.evaledHand as EvaledHand}
      }
  });

  let currentAction = newPlayers[turn].action;

  if (currentAction === 'CHECK') {
    currentAction = 'check';
  } else if (currentAction === 'check') {
    currentAction = 'CHECK';
  } else {
    currentAction = 'CHECK';
  }

  newPlayers[turn].action = currentAction;

  // newPlayers[turn].action = 'CHECK';

  return newPlayers;
}