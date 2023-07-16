import Link from "next/link";
import { ReactComponentElement, useState, useEffect, use } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";
import Player from "@/components/poker/Player";
import { shuffleCards, cards } from "@/lib/poker/poker-logic/poker.ts";

export interface PlayerObject {
id: number,
name: string,
money: number,
cards: Array<string>
smallBlind: number,
bigBlind: number,
bet: number,
hasFolded: boolean,
biggestBet?: number,
currentDealerId?: number
turn?: number,
// biggestBet: number,
}

type Stage = 'pre-flop' | 'flop' | 'turn' | 'river';

const Poker = (): JSX.Element => {

  const [baseDeck, setBaseDeck] = useState<Array<string>>(cards); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [deck, setDeck] = useState(shuffleCards(cards)); // Deck of cards in play
  // const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind
  // const [bigBlind, setBigBlind] = useState<number>(2); // Big blind
  const [playerWithBigBlind, setPlayerWithBigBlind] = useState<number>(0); // Id of the player with the big blind 
  const [biggestBet, setBiggestBet] = useState(0); // Biggest bet on the table
  const [playerWithBiggestBet, setPlayerWithBiggestBet] = useState(0); // Id of the player with the biggest bet
  const [pot, setPot] = useState(0); // Pot of money on the table
  const [currentDealerId, setCurrentDealerId] = useState(0); // Id of the current dealer
  const [tableMoney, setTableMoney] = useState(0); // Money on the table in the current round
  const [turn, setTurn] = useState(Math.floor(Math.random() * 4)); // Id of the player whose turn it is, randomly chosen at the start of the game
  const [communityCards, setCommunityCards] = useState<Array<string>>([]); // Community cards on the table
  const [currentStage, setCurrentStage] = useState<Stage>('flop'); // Current stage of the game

  // Populate the table with players (later with possibility to choose how many players to play against
  useEffect(() => {
    initializeGame(deck);
  }, [])

  
  const giveBlind = (players: Array<PlayerObject>, smallBlind: number, turn: number) => {
    // This function mimics randomlyGiveBlind, but it gives blind based on the turn of the player
    // Creating a copy of the players array to avoid mutating the state
    const newPlayers = players.filter(player => player.money > 0).map((player) => { 
      return {
        ...player,
      }
    })

    const length = newPlayers.length;

    if (length === 2) {
      if (turn === 0) {
        // Later add a check if the player has enough money to pay the big blind
        newPlayers[0].money -= smallBlind;
        newPlayers[0].bet += smallBlind;
        newPlayers[1].money -= smallBlind * 2;
        newPlayers[1].bet += smallBlind * 2;
        setPlayerWithBiggestBet(() => 1);
        setPlayerWithBigBlind(() => 1);
      } else {
        newPlayers[1].money -= smallBlind;
        newPlayers[1].bet += smallBlind;
        newPlayers[0].money -= smallBlind * 2;
        newPlayers[0].bet += smallBlind * 2;
        setPlayerWithBiggestBet(() => 0);
        setPlayerWithBigBlind(() => 0);
      }
    } else {
      // Here, unlike in randomlyGiveBlind, we pass the blinds to players that are before the current dealer in the array

        if (turn === 0) {
          newPlayers[length-1].money -= smallBlind*2;
          newPlayers[length-1].bet += smallBlind*2;
          newPlayers[length-2].money -= smallBlind;
          newPlayers[length-2].bet += smallBlind;
          setPlayerWithBiggestBet(() => length-1);
          setPlayerWithBigBlind(() => length-1);
        } else if (turn === 1) {
          newPlayers[0].money -= smallBlind*2;
          newPlayers[0].bet += smallBlind*2;
          newPlayers[length-1].money -= smallBlind;
          newPlayers[length-1].bet += smallBlind;
          setPlayerWithBiggestBet(() => 0);
          setPlayerWithBigBlind(() => 0);
        } else {
          newPlayers[turn-1].money -= smallBlind*2;
          newPlayers[turn-1].bet += smallBlind*2;
          newPlayers[turn-2].money -= smallBlind;
          newPlayers[turn-2].bet += smallBlind;
          setPlayerWithBiggestBet(() => turn-1);
          setPlayerWithBigBlind(() => turn-1);
        }
    }
    setCurrentDealerId(() => turn);
    setPot(() => smallBlind*3);
    setTableMoney(() => smallBlind*3);
    setBiggestBet(() => smallBlind*2);

    return newPlayers;

  }

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
        setPlayerWithBiggestBet(() => 0);
        setCurrentDealerId(() => i);
      } else {
        newPlayers[1].money -= smallBlind * 2;
        newPlayers[1].bet += smallBlind * 2;
        setPlayerWithBiggestBet(() => 1);
        setCurrentDealerId(() => i);
      }
    } else {
      if (i === length - 1) {
        // Later add a check if the player has enough money to pay the big blind
        newPlayers[0].money -= smallBlind * 2;
        newPlayers[0].bet += smallBlind * 2;
        setCurrentDealerId(1);
        setPlayerWithBiggestBet(0);
      } else {
        newPlayers[i + 1].money -= smallBlind * 2;
        newPlayers[i + 1].bet += smallBlind * 2;
        setPlayerWithBiggestBet(() => i + 1);
        newPlayers[i + 2] ? setCurrentDealerId(() => i + 2) : setCurrentDealerId(() => 0);
      }
    }
    setPot(() => smallBlind * 3);
    const biggestBet = smallBlind * 2;
    setBiggestBet(() => smallBlind * 2);
    // for (let player of newPlayers) {
    //   player.biggestBet = biggestBet;
    // }
    return newPlayers;
  }

  const passTurnToNextPlayer = (turn: number, players: Array<PlayerObject>) => {
    const newTurn = turn === players.length - 1 ? 0 : turn + 1;
    setTurn(() => newTurn);
    console.log('turn: ', newTurn);
  }

  // Call the biggest bet if the player has enough money, otherwise call all in
  const call = (player: PlayerObject, biggestBet: number) => {
    
  }

  const check = (turn: number, players: Array<PlayerObject>, playerWithBiggestBet: number, stage: Stage) => {
    // The only time the player with the biggest bet can do something is in the pre-flop stage
    if (turn === playerWithBigBlind && stage === 'flop') {
      // Deal cards or if there are 5 cards on the table, show the winner and go to the next round
    }
    if (turn === players.length - 1) {
      setTurn(() => 0);
    } else { 
      setTurn(() => turn + 1);
    }
  }

  // Deal the flop, turn and river
  const dealCommunityCards = (communityCards: Array<string> , deck: Array<string>, stage: Stage) => {
    const deckCopy = [...deck];
    const communityCardsCopy = [...communityCards];
    const cardsToDeal = stage === 'flop' ? 3 : stage === 'turn' || 'river' ? 1 : 0;
    const nextStage = stage === 'flop' ? 'turn' : stage === 'turn' ? 'river' : stage === 'river' ? 'flop' : 'flop';


    for (let i = 0; i < cardsToDeal; i++) {
      communityCardsCopy.push(deckCopy.pop() as string);
    }

    setCommunityCards(() => communityCardsCopy);
    setDeck(() => deckCopy);
    setCurrentStage(() => nextStage);

  }

  // Get the response from the server based on the players hand

  const getResponse = async() => {
    const response = await fetch('/api/eval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cards: ['Ac', 'Js', 'Jc']
      })
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  const createPlayers = (deck: Array<string>, numOfPlayers: number) => {
    const newDeck = [...deck];
    const newPlayers: Array<PlayerObject> = [];
    for (let i = 0; i < numOfPlayers; i++) {
      let playerCards = [newDeck.pop(), newDeck.pop()];
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        money: 1000,
        cards: playerCards as Array<string>,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0,
        hasFolded: false,
      })

    }
    setDeck(() => newDeck);
    return newPlayers;
  }

  // Function that starts the game
  const initializeGame = (deck: Array<string>) => {
    const newDeck = [...deck]
    const newPlayers: Array<PlayerObject> = giveBlind(createPlayers(newDeck, 4), 1, turn);
    setPlayers(() => newPlayers);
  }

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div onClick={() => {
            passTurnToNextPlayer(turn, players);
            }} 
            className={styles.table}>
            <div className={styles.pot}>Pot: {pot}$</div>
            {players.map((player) => {
              // console.log(player)
              return <Player 
              id={player.id} 
              name={player.name}
              money={player.money}
              key={player.name}
              cards={player.cards}
              smallBlind={player.smallBlind}
              bigBlind={player.bigBlind}
              bet={player.bet}
              hasFolded={player.hasFolded}
              biggestBet={biggestBet}
              currentDealerId={currentDealerId}
              turn={turn}
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