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
  const smallBlindPlayer = newPlayers[smallBlindTurn];
  const bigBlindPlayer = newPlayers[bigBlindTurn];

  const smallBet = smallBlindPlayer.money >= smallBlind ? smallBlind : smallBlindPlayer.money;
  const bigBet = bigBlindPlayer.money >= smallBlind*2 ? smallBlind*2 : bigBlindPlayer.money;

  smallBlindPlayer.money -= smallBet;
  smallBlindPlayer.bet += smallBet;
  bigBlindPlayer.money -= bigBet;
  bigBlindPlayer.bet += bigBet;
  
  return newPlayers;
}