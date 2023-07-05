import Link from "next/link";
import { ReactComponentElement, useState, useEffect } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";
import Player from "@/components/poker/Player";
import { shuffleCards, cards } from "@/lib/poker/poker-logic/poker.ts";

 export interface PlayerObject {
  id: number,
  name: string,
  turn: boolean,
  money: number,
  // cards: Array<string>
  cards: any
}

const Poker = (): JSX.Element => {

  const [players, setPlayers] = useState<Array<PlayerObject>>([]);
  const [deck, setDeck] = useState<Array<string>>(shuffleCards(cards))

  // Populate the table with players (later with possibility to choose how many players to play against)
  useEffect(() => {
    let newPlayers = [];
    for (let i = 1; i < 5; i++) {
      let playerCards = [deck.pop(), deck.pop()];
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        turn: false,
        money: 1000,
        cards: playerCards
      })
    }
    setDeck(deck);
    setPlayers(newPlayers);
  }, [])

  const getResponse = async() => {
    const response = await fetch('/api/eval');
    const data = await response.json();
    // await console.log(data);
    return data;
  }

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div onClick={getResponse} className={styles.table}>
            {players.map((player) => {
              // console.log(player)
              return <Player 
              id={player.id} 
              name={player.name}
              turn={player.turn}
              money={player.money}
              key={player.name}
              cards={player.cards}
              />
              
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;