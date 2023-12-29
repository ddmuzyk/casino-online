import { giveMoneyToWinners, getArrayOfWinners } from "@/lib/poker/poker-logic/functions/evaluation";
import '@testing-library/jest-dom';
import {expect, describe, it, jest, test} from '@jest/globals';
import { PlayerObject, EvaledHand } from '@/pages/game/poker.tsx';
import { decky } from "@/lib/poker/poker-logic/poker";
import { mockCreatePlayers } from "./blind.test";

// describe("giveMoneyToWinners", () => { 
//   test("giveMoneyToWinners", () => {
//     expect(1).toBe(1)
//   })
// });

describe('giveMoneyToWinners', () => {
  test('even pot', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    const winners = [0, 1]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1000)
    expect(newPlayers[0].money).toBe(1500)
    expect(newPlayers[1].money).toBe(1500)
  })
  test('odd pot', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    const winners = [0, 1]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1001)
    expect(newPlayers[0].money).toBe(1501)
    expect(newPlayers[1].money).toBe(1500)
  })
  test('one winner', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    const winners = [0]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1000)
    expect(newPlayers[0].money).toBe(2000)
  })
  test('3 winners', () => {
    const mockPlayers = mockCreatePlayers(3, 0, 1000)
    const winners = [0, 1, 2]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1000)
    expect(newPlayers[0].money).toBe(1334)
    expect(newPlayers[1].money).toBe(1333)
    expect(newPlayers[2].money).toBe(1333)
  })
  test('4 winners', () => {
    const mockPlayers = mockCreatePlayers(4, 0, 1000)
    const winners = [0, 1, 2, 3]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1000)
    expect(newPlayers[0].money).toBe(1250)
    expect(newPlayers[1].money).toBe(1250)
    expect(newPlayers[2].money).toBe(1250)
    expect(newPlayers[3].money).toBe(1250)
  })
  test('4 winners, odd pot', () => {
    const mockPlayers = mockCreatePlayers(4, 0, 1000)
    const winners = [0, 1, 2, 3]
    const newPlayers = giveMoneyToWinners(mockPlayers, winners, 1001)
    expect(newPlayers[0].money).toBe(1251)
    expect(newPlayers[1].money).toBe(1250)
    expect(newPlayers[2].money).toBe(1250)
    expect(newPlayers[3].money).toBe(1250)
  })
})   