import { giveBlind } from "@/lib/poker/poker-logic/functions/blind";
import '@testing-library/jest-dom';
import {expect, test, jest, describe} from '@jest/globals';
import { PlayerObject, EvaledHand } from '@/pages/game/poker.tsx';
import { decky } from "@/lib/poker/poker-logic/poker";
//

export const mockCreatePlayers = (numberOfPlayers: number, currentDealerId: number, moneyAmount: number) => {
  const mockPlayers: PlayerObject[] = [] 
  const mockDeck = [...decky]
  for (let i = 0; i < numberOfPlayers; i++) {
    let playerCards = [mockDeck.pop(), mockDeck.pop()]; 
    mockPlayers.push({ 
      id: i,
      name: `Player${i}`,
      money: moneyAmount,
      cards: playerCards as Array<string>,
      action: '-',
      evaledHand: {handName: 'flush', handRank: 2950, handType: 1,  value: 1930,} as EvaledHand,
      smallBlind: 0,
      bigBlind: 0,
      bet: 0,
      hasFolded: false,
      won: false,
      out: false,
    })
  }
  return mockPlayers
}

describe('giveBlind', () => {
  test('3 players, full money', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    const newPlayers = giveBlind(mockPlayers, 5, 0)
    expect(newPlayers[0].money).toBe(1000)
    expect(newPlayers[1].money).toBe(995)
    expect(newPlayers[2].money).toBe(990)
  })

  test('3 players, not full money', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    mockPlayers[1].money = 3
    let newPlayers = giveBlind(mockPlayers, 5, 0)
    expect(newPlayers[0].money).toBe(1000)
    expect(newPlayers[1].money).toBe(0)
    expect(newPlayers[2].money).toBe(990)
  })

  test('2 players, full money', () => {
    const mockPlayers = mockCreatePlayers(2, 0, 1000)
    const newPlayers = giveBlind(mockPlayers, 5, 0)
    expect(newPlayers[0].money).toBe(995)
    expect(newPlayers[1].money).toBe(990)
  })

  test('2 players, not full money', () => {
    const mockPlayers = mockCreatePlayers(2, 0, 1000)
    mockPlayers[0].money = 3
    mockPlayers[1].money = 3
    const newPlayers = giveBlind(mockPlayers, 5, 0)
    expect(newPlayers[0].money).toBe(0)
    expect(newPlayers[1].money).toBe(0)
  })
  
})