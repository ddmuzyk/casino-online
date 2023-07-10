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
  smallBlind: number,
  bigBlind: number,
  bet: number,
  biggestBet: number,
  currentDealerId?: number
  // biggestBet: number,
}

const Poker = (): JSX.Element => {

  const [baseDeck, setBaseDeck] = useState<Array<string>>(shuffleCards(cards)); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [deck, setDeck] = useState<Array<string>>(shuffleCards(cards)); // Deck of cards in play
  // const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind
  // const [bigBlind, setBigBlind] = useState<number>(2); // Big blind
  const [biggestBet, setBiggestBet] = useState<number>(0); // Biggest bet on the table
  const [playerWithBiggestBet, setPlayerWithBiggestBet] = useState<number>(0); // Id of the player with the biggest bet
  const [pot, setPot] = useState<number>(0); // Pot of money on the table
  const [currentDealerId, setCurrentDealerId] = useState<number>(0); // Id of the current dealer
  const [tableMoney, setTableMoney] = useState<number>(0); // Money on the table in the current round

  // Populate the table with players (later with possibility to choose how many players to play against
  useEffect(() => {
    let newPlayers: Array<PlayerObject> = [];
    for (let i = 0; i < 4; i++) {
      let playerCards = [deck.pop(), deck.pop()];
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        turn: false,
        money: 1000,
        cards: playerCards as Array<string>,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0,
        biggestBet: biggestBet
      })
    }
    newPlayers = randomlyGiveBlind(newPlayers, 1);
    // console.log(deck.length);
    // console.log(baseDeck.length);
    setDeck(deck);
    setPlayers(newPlayers);
  }, [])

  // Give the small blind to a random player, and the big blind to the next player in the array
  // Also set the current dealer id, the pot and player with the biggest bet (to be added later)
  const randomlyGiveBlind = (players: Array<PlayerObject>, smallBlind: number): any => {
    // Creating a copy of the players array to avoid mutating the state
    const newPlayers = players.filter(player => player.money > 0).map((player) => {
      return {
        ...player,
      }
    })
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
    const biggestBet = smallBlind * 2;
    setBiggestBet(smallBlind * 2);
    for (let player of newPlayers) {
      player.biggestBet = biggestBet;
    }
    return newPlayers;
  }

  // Call the big blind if the player has enough money, otherwise call all in
  const call = (player: PlayerObject, biggestBet: number) => {
    
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
          <div onClick={() => console.log(players)} className={styles.table}>
            <div className={styles.pot}>Pot: {pot}$</div>
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
              bet={player.bet}
              biggestBet={biggestBet}
              currentDealerId={currentDealerId}
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