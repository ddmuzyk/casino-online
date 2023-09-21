import { Stage, PlayerObject, NumOrNull, EvaledHand } from "@/pages/game/poker";
import { getNextTurn } from "./turns";

export const giveBlind = (players: Array<PlayerObject>, smallBlind: number, currentDealerId: number) => {

  const newPlayers = players.map((player) => { 
    return {
      ...player,
      cards: [...player.cards],
      evaledHand: {...player.evaledHand as EvaledHand},
    }
  })

  const smallBlindTurn = getNextTurn(currentDealerId, newPlayers);
  const bigBlindTurn = getNextTurn(smallBlindTurn, newPlayers);

  newPlayers[smallBlindTurn].money -= smallBlind;
  newPlayers[smallBlindTurn].bet += smallBlind;
  newPlayers[bigBlindTurn].money -= smallBlind*2;
  newPlayers[bigBlindTurn].bet += smallBlind*2;
  
  return newPlayers;
}