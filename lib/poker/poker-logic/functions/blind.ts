import { Stage, PlayerObject, NumOrNull, EvaledHand } from "@/pages/game/poker";
import { getNextTurn } from "./turns";
import { getNumberOfPlayersInGame } from "./checks";

export const giveBlind = (players: Array<PlayerObject>, smallBlind: number, currentDealerId: number) => {

  const newPlayers = players.map((player) => { 
    return {
      ...player,
      cards: [...player.cards],
      evaledHand: {...player.evaledHand as EvaledHand},
    }
  })

  const activePlayers = getNumberOfPlayersInGame(newPlayers);

  const smallBlindTurn = activePlayers > 2 ? getNextTurn(currentDealerId, newPlayers) : currentDealerId;
  const bigBlindTurn = getNextTurn(smallBlindTurn, newPlayers);

  newPlayers[smallBlindTurn].money -= smallBlind;
  newPlayers[smallBlindTurn].bet += smallBlind;
  newPlayers[bigBlindTurn].money -= smallBlind*2;
  newPlayers[bigBlindTurn].bet += smallBlind*2;
  
  return newPlayers;
}