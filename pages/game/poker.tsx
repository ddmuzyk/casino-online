import Link from "next/link";
import { ReactComponentElement, useState, useEffect, use } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";
import Player from "@/components/poker/Player";
import { shuffleCards, cards, decky, SUITS, VALUES } from "@/lib/poker/poker-logic/poker.ts";
import { time } from "console";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { get } from "http";

export interface PlayerObject {
id: number,
name: string,
money: number,
cards: Array<string>
smallBlind: number,
bigBlind: number,
bet: number,
hasFolded: boolean,
evaledHand?: EvaledHand,
biggestBet?: number,
currentDealerId?: number
turn?: NumOrNull,
cardsAreDealt?: boolean,
// biggestBet: number,
}

interface EvaledHand {
  handName: string,
  handRank: number,
  handType: number,
  value: number,
}

type Stage = 'pre-flop' | 'flop' | 'turn' | 'river';
type NumOrNull = number | null;

const Poker = (): JSX.Element => {

  // Change some state variables to normal variables, because they don't need to be re-rendered!!!

  const [baseDeck, setBaseDeck] = useState<Array<string>>(cards); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [activePlayers, setActivePlayers] = useState<Array<PlayerObject>>([]); // Players that didn't fold yet
  const [deck, setDeck] = useState(decky); // Deck of cards in play
  // const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind
  // const [bigBlind, setBigBlind] = useState<number>(2); // Big blind
  const [playerWithBigBlind, setPlayerWithBigBlind] = useState<number>(10); // Id of the player with the big blind 
  const [biggestBet, setBiggestBet] = useState(0); // Biggest bet on the table
  const [playerWithBiggestBet, setPlayerWithBiggestBet] = useState<NumOrNull>(null); // Id of the player with the biggest bet
  // const [playerThatShouldntMove, setPlayerThatShouldntMove] = useState<number>(10); // Id of the player that shouldn't move (the player raised and everyone called him, so he can't do anything anymore)
  const [pot, setPot] = useState(0); // Pot of money on the table
  const [currentDealerId, setCurrentDealerId] = useState<NumOrNull>(null); // Id of the current dealer
  const [playerThatBegins, setPlayerThatBegins] = useState<NumOrNull>(null); // Id of the player that begins the game (if current dealer has folded)
  const [tableMoney, setTableMoney] = useState(0); // Money on the table in the current round
  const [turn, setTurn] = useState<NumOrNull>(2); // Id of the player whose turn it is, randomly chosen at the start of the game
  const [communityCards, setCommunityCards] = useState<Array<string>>([]); // Community cards on the table
  const [cardsVisible, setCardsVisible] = useState(true); // Boolean that checks if the cards are visible or not
  const [currentStage, setCurrentStage] = useState<Stage>('pre-flop'); // Current stage of the game
  // const [didGameStart, setDidGameStart] = useState(false); // Boolean that checks if the game has started
  // const [cardsClassname, setCardsClassname] = useState('hidden'); // Classname of the cards (hidden or visible)
  // const [isVisible, setIsVisible] = useState(false); 
  const [cardsAreDealt, setCardsAreDealt] = useState(false); // Boolean that checks if the cards are dealt or not
  // const [triggerStartGameLoop, setTriggerStartGameLoop] = useState(false); // Boolean that triggers the game loop
  const [isComputerMove, setIsComputerMove] = useState(turn === 0 ? false : true); // Boolean that checks if the computer is making a move
  const [winner, setWinner] = useState<NumOrNull>(null); // Id of the winner of the game

  function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  async function sleep(ms: number) {
    await timeout(ms);
  }
  // Populate the table with players (later with possibility to choose how many players to play against
  useEffect(() => {
    initializeGame(deck);
  }, [])

  useEffect(() => {
    // console.log('players changed to: ', players);
    if ((turn !== 0 && players.length && !cardsAreDealt)) startGameLoop(players, turn, biggestBet, tableMoney, currentStage, playerWithBiggestBet, pot , playerThatBegins as number);
  }, [players, cardsAreDealt]);

  useEffect(() => {
    // console.log('isComputerMove changed to: ', isComputerMove)
  }, [isComputerMove]);

  
  const giveBlind = (players: Array<PlayerObject>, smallBlind: number, turn: number) => {
    // This function mimics randomlyGiveBlind, but it gives blind based on the turn of the player
    // Creating a copy of the players array to avoid mutating the state
    const newPlayers = players.filter(player => player.money > 0).map((player) => { 
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand},
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
        // setPlayerWithBiggestBet(() => 1);
        setPlayerWithBigBlind(() => 1);
      } else {
        newPlayers[1].money -= smallBlind;
        newPlayers[1].bet += smallBlind;
        newPlayers[0].money -= smallBlind * 2;
        newPlayers[0].bet += smallBlind * 2;
        // setPlayerWithBiggestBet(() => 0);
        setPlayerWithBigBlind(() => 0);
      }
    } else {
      // Here, unlike in randomlyGiveBlind, we pass the blinds to players that are before the current dealer in the array

        if (turn === 0) {
          newPlayers[length-1].money -= smallBlind*2;
          newPlayers[length-1].bet += smallBlind*2;
          newPlayers[length-2].money -= smallBlind;
          newPlayers[length-2].bet += smallBlind;
          // setPlayerWithBiggestBet(() => length-1);
          setPlayerWithBigBlind(() => length-1);
        } else if (turn === 1) {
          newPlayers[0].money -= smallBlind*2;
          newPlayers[0].bet += smallBlind*2;
          newPlayers[length-1].money -= smallBlind;
          newPlayers[length-1].bet += smallBlind;
          // setPlayerWithBiggestBet(() => 0);
          setPlayerWithBigBlind(() => 0);
        } else {
          newPlayers[turn-1].money -= smallBlind*2;
          newPlayers[turn-1].bet += smallBlind*2;
          newPlayers[turn-2].money -= smallBlind;
          newPlayers[turn-2].bet += smallBlind;
          // setPlayerWithBiggestBet(() => turn-1);
          setPlayerWithBigBlind(() => turn-1);
        }
    }
    setCurrentDealerId(() => turn);
    setPlayerThatBegins(() => turn);
    // setPot(() => smallBlind*3);
    setTableMoney(() => smallBlind*3);
    setBiggestBet(() => smallBlind*2);

    return newPlayers;

  }

  // Give the small blind to a random player, and the big blind to the next player in the array
  // Also set the current dealer id, the pot and player with the biggest bet (to be added later)

  const makeUserMove = async(turn: number, players: Array<PlayerObject>, biggestBet: number, tableMoney: number, playerWithBiggestBet: NumOrNull, stage: Stage, pot: number) => {
    // setIsComputerMove(() => false);
    let playersCopy = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    });
    const player = playersCopy[turn];

    const evaledHand = await getEvaluation(player, communityCards);
    player.evaledHand = evaledHand;

    const nextTurn = getNextTurn(turn as number, players);
    const cardsShouldBeDealt = checkIfCardsShouldBeDealt(nextTurn, currentStage, tableMoney, playerWithBiggestBet, playerThatBegins as number);

    if (cardsShouldBeDealt) {
      onRoundEnd(playersCopy, stage, pot, playerThatBegins);   
    } 
    else {
      setTurn(() => nextTurn);
      setPlayers(() => playersCopy);
    }
  }
  
  const makeComputerMove = async(turn: number, players: Array<PlayerObject>, biggestBet: number, tableMoney: number, playerWithBiggestBet: NumOrNull, stage: Stage) => {
    // setIsComputerMove(() => true);

    const playersCopy = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    });
    const player = playersCopy[turn];
    
    const evaledHand = await getEvaluation(player, communityCards);
    player.evaledHand = evaledHand;
    
    // console.log(playersCopy)
    await sleep(1000);

    // console.log('Hand: ', player.evaledHand);

    const moneyToCall = biggestBet - player.bet;
    if (moneyToCall > 0) {
      return call(turn, playersCopy, biggestBet, moneyToCall, tableMoney);
    } else {
      return check(turn, playersCopy, playerWithBiggestBet, stage);  
    } 
  }
  

  const startGameLoop = async (
    players: Array<PlayerObject>, 
    turn: NumOrNull, 
    biggestBet: number, 
    tableMoney: number,
    stage: Stage,
    playerWithBiggestBet: NumOrNull,
    pot: number,
    // currentDealerId: number,
    // playerWithBigBlind: number,
    playerThatBegins: number,
    ) => {
      // Maybe add this check to the player after to be able to trigger a rerender with setTurn to PlayerThatBegins
      
      let playersCopy: Array<PlayerObject> = players.map((player) => {
        return {
          ...player,
          cards: [...player.cards],
          evaledHand: {...player.evaledHand as EvaledHand}
        }
      });
      if (turn && players.length > 0) {
        playersCopy = await makeComputerMove(turn as number, playersCopy, biggestBet, tableMoney, playerWithBiggestBet, stage);
      }

      // players = newFellas;

      // setPlayers(() => players);
      
      const nextTurn = getNextTurn(turn as number, players);
      const cardsShouldBeDealt = checkIfCardsShouldBeDealt(nextTurn, currentStage, tableMoney, playerWithBiggestBet, playerThatBegins as number);
      if (cardsShouldBeDealt) {
        onRoundEnd(playersCopy, stage, pot, playerThatBegins);
      } 
      else {
        setTurn(() => nextTurn);
        setPlayers(() => playersCopy);
      }

  }

  const onRoundEnd = async (players: Array<PlayerObject>, stage: Stage, 
    pot: number, playerThatBegins: NumOrNull,
    ) => {

      let playersCopy = players.map((player) => {
        return {
          ...player,
          cards: [...player.cards],
          evaledHand: {...player.evaledHand as EvaledHand}
        }
      });

      if (stage === 'river') {
        setCardsAreDealt(() => true);
        const winners = getArrayOfWinners(playersCopy);
        playersCopy = giveMoneyToWinners(playersCopy, winners, pot);
        setPot(() => 0);
        setTurn(() => null);
        setPlayers(() => playersCopy);
        await sleep(1000);
        setCardsVisible(() => false);
        await sleep(1000);
        setCommunityCards(() => []);
        setCardsVisible(() => true);
        console.log('winners: ', winners);
      } else {
        setCardsAreDealt(() => true);
        playersCopy = resetRoundState(playersCopy);
        setPlayers(() => playersCopy);
        dealCommunityCards(communityCards, deck, currentStage);
        await sleep(1000);
        setTurn(() => null)
        // await sleep(1000);
        setTurn(playerThatBegins);
        setCardsAreDealt(() => false);
      }
  }

  const resetRoundState = (players: Array<PlayerObject>) => {
    setPot(() => pot + tableMoney);
    setTableMoney(() => 0);
    setPlayerWithBiggestBet(() => null);
    setBiggestBet(() => 0);
    const newPlayers = players.map((player) => {
      return {
        ...player,
        bet: 0,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    })
    // setPlayers(() => newPlayers);
    return newPlayers;
  }

  const resetGame = () => {
    
  }

  const checkIfCardsShouldBeDealt = (
    turn: number, 
    stage: Stage, 
    tableMoney: number,
    playerWithBiggestBet: NumOrNull,
    playerThatBegins: number,
    ) => {
      // console.log('turn :', turn);
      // console.log('playerWithBiggestBet: ', playerWithBiggestBet);
      return (turn === playerWithBiggestBet || (!tableMoney && turn === playerThatBegins)) 

      // && stage !== 'river';
      // Here I can remove the check if the stage is river, instead add a check in other functions and if it's river, we determine the winner
  }

  const getNextTurn = (turn: number, players: Array<PlayerObject>) => {
    const newTurn = turn === players.length - 1 ? 0 : turn + 1;
    return newTurn;
  }

  // Call the biggest bet if the player has enough money, otherwise call all in
  const call = (turn: number , players: Array<PlayerObject>, biggestBet: number, moneyToCall: number, tableMoney: number) => {
    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
        }
    });
    if (playerWithBiggestBet === null) {
      setPlayerWithBiggestBet(() => turn);
    }
    const player = newPlayers[turn];
    // console.log('copy of player: ', player);
    player.money -= moneyToCall;
    player.bet += moneyToCall;
    // setPlayers(() => newPlayers);
    setTableMoney(() => tableMoney + moneyToCall);
    return newPlayers;
    // setTurn(() => getNextTurn(turn, players));
  }

  const check = (turn: number, players: Array<PlayerObject>, playerWithBiggestBet: NumOrNull, stage: Stage) => {
    // console.log('turn: ', turn);
    // console.log(players)
    return players.map((player) => { 
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      } 
    });
    // const newTurn = getNextTurn(turn, players);
    // setTurn(() => newTurn);
  }

  // Deal the flop, turn and river
  const dealCommunityCards = (communityCards: Array<string> , deck: Array<string>, stage: Stage) => {
    const deckCopy = [...deck];
    const communityCardsCopy = [...communityCards];
    const cardsToDeal = stage === 'pre-flop' ? 3 : stage === 'flop' || 'turn' ? 1 : 0;
    const nextStage = stage === 'pre-flop' ? 'flop' : stage === 'flop' ? 'turn' : stage === 'turn' ? 'river' : 'pre-flop';

    // console.log('cards to deal: ',cardsToDeal)

    for (let i = 0; i < cardsToDeal; i++) {
      communityCardsCopy.push(deckCopy.pop() as string);
    }

    setCommunityCards(() => communityCardsCopy);
    setDeck(() => deckCopy);
    setCurrentStage(() => nextStage);

  }

  // Get the response from the server based on the players hand

  const getEvaluation = async(player: PlayerObject, communityCards: Array<string>) => {
    
    // console.log(player)
    const playerCards: Array<string> = [...player.cards];
    if (!communityCards.length) {
      // Here I have to make a pseudo card so that the server can evaluate the hand
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      for (let i  = Math.floor(Math.random() * 10); i < VALUES.length; i++) {
        if (VALUES[i] !== playerCards[0][0] && VALUES[i] !== playerCards[1][0]) {
          const card = VALUES[i] + suit;
          playerCards.push(card); 
          break;
        }
      }
    } else {
      playerCards.push(...communityCards);
    }

    const response = await fetch('/api/eval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cards: playerCards, //temporary solution
      })
    });
    const data = await response.json();

    // console.log(`${player.name}'s hand: `, data);

    return data;
  }

  const getArrayOfWinners = (players: Array<PlayerObject>) => {
    // This array will contain the index of the players with the highest hand, there can be more than one if they have the same hand
    const highestHands: Array<number> = [];
    let highestValue = 0;
    for (let player of players) {
      let playersHand = player.evaledHand as EvaledHand;
      if (!player.hasFolded && playersHand.value > highestValue) {
        highestValue = playersHand.value;
      }
    }
    for (let i = 0; i < players.length; i++) {
      let playersHand = players[i].evaledHand as EvaledHand;

      if (!players[i].hasFolded && playersHand.value === highestValue) {
        highestHands.push(i);
      }
    }

    return highestHands;
  }

  const giveMoneyToWinners = (players: Array<PlayerObject>, winners: Array<number>, tableMoney: number) => {
    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    });
    const moneyToGive = Math.floor(tableMoney / winners.length);
    const moneyLeft = tableMoney % winners.length;

    for (let i = 0; i < winners.length; i++) {
      newPlayers[winners[i]].money += moneyToGive;
    }

    if (moneyLeft) {
      const moneyToGive = Math.floor(moneyLeft / winners.length);
      for (let i = 0; i < winners.length; i++) {
        newPlayers[winners[i]].money += moneyToGive;
      }
    }
    
    return newPlayers;
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
        evaledHand: {} as EvaledHand,
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
    const newPlayers: Array<PlayerObject> = giveBlind(createPlayers(newDeck, 4), 1, turn as number);
    // setActivePlayers(() => newPlayers);
    setPlayers(() => newPlayers);
  }

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div onClick={() => {
              console.log(players);
            }} 
            className={styles.table}>
            <div className={styles.pot}>Pot: <span className={styles.potValue} key={pot}>{pot}$</span></div>
            <div className={`${styles.communityCards} ${cardsVisible ? "" : styles.communityCardsHidden}`}>
              {communityCards.map((card, id) => {
                return (
                <CSSTransition
                in={communityCards.length > 0}
                timeout={200}
                classNames={{
                  appearDone: styles.imageAppearDone,
                  enterActive: styles.imageEnterActive,
                  enterDone: styles.imageEnterDone,
                  exit: styles.imageExit,
                  exitActive: styles.imageExitActive,
                  exitDone: styles.imageExitDone,
                }
                }
                key={id}
                // unmountOnExit={true}
                appear={true}
                // unmountOnExit={true}
                >
                  <img 
                  className={`${styles.image}`} 
                  src={`/svg-cards/${card}.svg`} 
                  alt="community card" 
                  key={card}>
                  </img>
                </CSSTransition>
                )
              })} 
            </div>
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
                currentDealerId={currentDealerId as number}
                turn={turn as number}
                cardsAreDealt={cardsAreDealt}
              />             
              })}
          </div>
        </div>
        {/* Write me a div that contains player buttons: check, call, raise, all in */}
        {/* ISSUE IS WITH THE FUNCTION FROM PLAYER I GUESS */}
        <div className={styles.playerButtons}>
          <button onClick={() => {
            if (turn === 0) {
              const newPlayers = check(turn as number, players, playerWithBiggestBet, currentStage);
              makeUserMove(turn as number, newPlayers, biggestBet, tableMoney, playerWithBiggestBet, currentStage, pot)
            };
          }} className={styles.playerBtn}>Check</button>
          <button onClick={() => {
            if (turn === 0) {
              const newPlayers = call(turn as number, players, biggestBet, biggestBet - players[turn as number].bet, tableMoney)
              makeUserMove(turn as number, newPlayers, biggestBet, tableMoney, playerWithBiggestBet, currentStage, pot)
            }
          }} className={styles.playerBtn}>Call</button>
          <button className={styles.playerBtn}>Raise</button>
          <button className={styles.playerBtn}>Fold</button>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;