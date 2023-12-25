import { giveBlind } from "@/lib/poker/poker-logic/functions/blind";
import '@testing-library/jest-dom';
import {expect, test, jest, describe} from '@jest/globals';
import { PlayerObject, EvaledHand } from '@/pages/game/poker.tsx';
import { decky } from "@/lib/poker/poker-logic/poker";
//

describe('Blind', () => {
  test('giveBlind', () => {
    const mockPlayers: PlayerObject[] = [] 
    const mockDeck = [...decky]
    for (let i = 0; i < 3; i++) {
      let playerCards = [mockDeck.pop(), mockDeck.pop()]; 
      mockPlayers.push({ 
        id: i,
        name: `Player${i}`,
        money: i == 0 ? 2000 : 1000,
        cards: playerCards as Array<string>,
        action: '-',
        evaledHand: {} as EvaledHand,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0,
        hasFolded: false,
        won: false,
        out: false,
      })
    }
    const newPlayers = giveBlind(mockPlayers, 5, 0)
    expect(newPlayers[0].money).toBe(2000)
    expect(newPlayers[1].money).toBe(995)
    expect(newPlayers[2].money).toBe(990)
  })
  
})