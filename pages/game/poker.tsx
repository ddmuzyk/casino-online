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
  cards: Array<string>
  // cards: any,
  smallBlind: number,
  bigBlind: number,
  bet: number
}

const Poker = (): JSX.Element => {

  const [baseDeck, setBaseDeck] = useState<Array<string>>(shuffleCards(cards)); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [deck, setDeck] = useState<Array<string>>(shuffleCards(cards)); // Deck of cards in play
  // const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind
  // const [bigBlind, setBigBlind] = useState<number>(2); // Big blind
  const [biggestBet, setBiggestBet] = useState<number>(0); // Biggest bet on the table
  const [pot, setPot] = useState<number>(0); // Pot of money on the table
  const [currentDealerId, setCurrentDealerId] = useState<number>(0); // Id of the current dealer

  // Populate the table with players (later with possibility to choose how many players to play against
  useEffect(() => {
    let newPlayers: Array<PlayerObject> = [];
    for (let i = 1; i < 5; i++) {
      let playerCards = [deck.pop(), deck.pop()];
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        turn: false,
        money: 1000,
        cards: playerCards as Array<string>,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0
      })
    }
    newPlayers = randomlyGiveBlind(newPlayers, 1);
    // console.log(deck.length);
    // console.log(baseDeck.length);
    setDeck(deck);
    setPlayers(newPlayers);
  }, [])

  // Give the small blind to a random player, and the big blind to the next player in the array
  const randomlyGiveBlind = (players: Array<PlayerObject>, smallBlind: number): any => {
    const newPlayers = players.filter(player => player.money > 0);
    const length = newPlayers.length;
    let i = Math.floor(Math.random() * length);
    newPlayers[i].money -= smallBlind;
    newPlayers[i].bet += smallBlind;
    if (length === 2) {
      if (i === 1) {
        // Later add a check if the player has enough money to pay the big blind
        newPlayers[0].money -= smallBlind * 2;
        newPlayers[0].bet += smallBlind * 2;
        setCurrentDealerId(i);
      } else {
        newPlayers[1].money -= smallBlind * 2;
        newPlayers[1].bet += smallBlind * 2;
        setCurrentDealerId(i);
      }
    } else {
      if (i === length - 1) {
        // Later add a check if the player has enough money to pay the big blind
        newPlayers[0].money -= smallBlind * 2;
        newPlayers[0].bet += smallBlind * 2;
        setCurrentDealerId(1);
      } else {
        newPlayers[i + 1].money -= smallBlind * 2;
        newPlayers[i + 1].bet += smallBlind * 2;
        newPlayers[i + 2] ? setCurrentDealerId(i + 2) : setCurrentDealerId(0);
      }
    }
    setPot(smallBlind * 3);
    // if (i === length - 1) {
    //   newPlayers[0].bigBlind = smallBlind * 2;
    //   return newPlayers;
    // } else {
    //   newPlayers[i + 1].bigBlind = smallBlind * 2;
    //   return newPlayers;
    // }
    return newPlayers;
  }

  // Call the big blind if the player has enough money, otherwise call all in
  const call = (player: PlayerObject, bigBlind: number) => {
    
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
              // console.log(player)
              return <Player 
              id={player.id} 
              name={player.name}
              turn={player.turn}
              money={player.money}
              key={player.name}
              cards={player.cards}
              smallBlind={player.smallBlind}
              bigBlind={player.bigBlind}
              bet={player.bet}
              />             
            })}
          </div>
        </div>
        {/* Write me a div that contains player buttons: check, call, raise, all in */}
        <div className={styles.playerButtons}>
          <button className={styles.playerBtn}>Check</button>
          <button className={styles.playerBtn}>Call</button>
          <button className={styles.playerBtn}>Raise</button>
          <button className={styles.playerBtn}>All in</button>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;