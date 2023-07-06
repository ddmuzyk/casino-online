import Link from "next/link";
import { ReactComponentElement, useState, useEffect, use } from "react";
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
  cards: any,
  smallBlind: number,
  bigBlind: number
}

const Poker = (): JSX.Element => {

  const [baseDeck, setBaseDeck] = useState<Array<string>>(shuffleCards(cards)); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [deck, setDeck] = useState<Array<string>>(shuffleCards(cards)); // Deck of cards in play
  const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind

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
        cards: playerCards,
        smallBlind: 0,
        bigBlind: 0
      })
    }
    newPlayers = randomlyGiveBlind(newPlayers, smallBlind);
    // console.log(deck.length);
    // console.log(baseDeck.length);
    setDeck(deck);
    setPlayers(newPlayers) as any;
  }, [])

  // Give the small blind to a random player, and the big blind to the next player in the array
  const randomlyGiveBlind = (players: any, smallBlind: number) => {
    const newPlayers = [...players];
    const length = newPlayers.length;
    let i = Math.floor(Math.random() * length);
    newPlayers[i].smallBlind = smallBlind;
    if (i === length - 1) {
      newPlayers[0].bigBlind = smallBlind * 2;
      return newPlayers;
    } else {
      newPlayers[i + 1].bigBlind = smallBlind * 2;
      return newPlayers;
    }
  }

  // Get the response from the server based on the players hand

  const getResponse = async() => {
    const response = await fetch('/api/eval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cards: ['Ac', 'As', '2c']
      })
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div onClick={getResponse} className={styles.table}>
            {players.map((player) => {
              console.log(player)
              return <Player 
              id={player.id} 
              name={player.name}
              turn={player.turn}
              money={player.money}
              key={player.name}
              cards={player.cards}
              smallBlind={player.smallBlind}
              bigBlind={player.bigBlind}
              />             
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;