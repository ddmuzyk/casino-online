import Link from "next/link";
import { ReactComponentElement, useState, useEffect, useRef } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";
import Player from "@/components/poker/Player/Player";
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
action: string,
// actionVisible?: boolean,
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

  const [gameInitialized, setGameInitialized] = useState(false); // Boolean that checks if the game has started
  const [baseDeck, setBaseDeck] = useState<Array<string>>(cards); // Base deck of cards
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); // Players in the game
  const [activePlayers, setActivePlayers] = useState<Array<PlayerObject>>([]); // Players that didn't fold yet
  const [deck, setDeck] = useState(decky); // Deck of cards in play
  const [smallBlind, setSmallBlind] = useState<number>(1); // Small blind
  // const [bigBlind, setBigBlind] = useState<number>(2); // Big blind
  const [playerWithBigBlind, setPlayerWithBigBlind] = useState<number>(10); // Id of the player with the big blind 
  const [biggestBet, setBiggestBet] = useState(0); // Biggest bet on the table
  const [playerWithBiggestBet, setPlayerWithBiggestBet] = useState<NumOrNull>(null); // Id of the player with the biggest bet
  // const [playerThatShouldntMove, setPlayerThatShouldntMove] = useState<number>(10); // Id of the player that shouldn't move (the player raised and everyone called him, so he can't do anything anymore)
  const [pot, setPot] = useState(0); // Pot of money on the table
  const [currentDealerId, setCurrentDealerId] = useState<NumOrNull>(0); // Id of the current dealer
  const [playerThatBegins, setPlayerThatBegins] = useState<NumOrNull>(null); // Id of the player that begins the game (if current dealer has folded)
  const [tableMoney, setTableMoney] = useState(0); // Money on the table in the current round
  const [turn, setTurn] = useState<NumOrNull>(null); // Id of the player whose turn it is, randomly chosen at the start of the game
  const [communityCards, setCommunityCards] = useState<Array<string>>([]); // Community cards on the table
  const [cardsVisible, setCardsVisible] = useState(true); // Boolean that checks if the cards are visible or not
  const [currentStage, setCurrentStage] = useState<Stage>('pre-flop'); // Current stage of the game
  // const [didGameStart, setDidGameStart] = useState(false); // Boolean that checks if the game has started
  // const [cardsClassname, setCardsClassname] = useState('hidden'); // Classname of the cards (hidden or visible)
  // const [isVisible, setIsVisible] = useState(false); 
  const [cardsAreDealt, setCardsAreDealt] = useState(true); // Boolean that checks if the cards are dealt or not
  // const [triggerStartGameLoop, setTriggerStartGameLoop] = useState(false); // Boolean that triggers the game loop
  const [isComputerMove, setIsComputerMove] = useState(turn === 0 ? false : true); // Boolean that checks if the computer is making a move
  const [winners, setWinners] = useState<Array<number>>([]); // Id of the winner of the game
  const [actionVisibility, setActionVisibility] = useState<Array<boolean>>([]); // Boolean that checks if the actions are visible or not

  const abilityToMove = useRef(true); // Ref that checks if the player can move or not

  function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  async function sleep(ms: number) {
    await timeout(ms);
  }
  // Populate the table with players (later with possibility to choose how many players to play against
  useEffect(() => {
    if (!gameInitialized) initializeGame(deck);
  }, [])

  useEffect(() => {
    // console.log('players changed to: ', players);
    if ((turn !== 0 && players.length && !cardsAreDealt)) startGameLoop(players, turn, biggestBet, tableMoney, currentStage, playerWithBiggestBet, pot , playerThatBegins as number);
  }, [players, cardsAreDealt]);

  useEffect(() => {
    // console.log('isComputerMove changed to: ', isComputerMove)
  }, [isComputerMove]);

  
  const giveBlind = (players: Array<PlayerObject>, smallBlind: number, currentDealerId: number) => {
    // This function mimics randomlyGiveBlind, but it gives blind based on the turn of the player
    // Creating a copy of the players array to avoid mutating the state
    const newPlayers = players.map((player) => { 
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand},
      }
    })

    const smallBlindTurn = getNextTurn(currentDealerId, newPlayers);
    const bigBlindTurn = getNextTurn(smallBlindTurn, newPlayers);

    newPlayers[smallBlindTurn].money -= smallBlind;
    newPlayers[smallBlindTurn].bet += smallBlind;
    newPlayers[bigBlindTurn].money -= smallBlind*2;
    newPlayers[bigBlindTurn].bet += smallBlind*2;

    return newPlayers;

  }

  const setInitialValues = (players: Array<PlayerObject>, smallBlind: number, newCurrentDealerId: number) => {
    abilityToMove.current = true;
    setCurrentDealerId(() => newCurrentDealerId);
    setPlayerThatBegins(() => getNextTurn(newCurrentDealerId, players));
    setPlayerWithBiggestBet(() => null);
    setPot(() => smallBlind*3);
    setTableMoney(() => smallBlind*3);
    setBiggestBet(() => smallBlind*2);
    setCommunityCards(() => []);
    setCardsVisible(() => true);
    setCurrentStage(() => 'pre-flop');
    setPlayers(() => players);
  }

  const makeUserMove = async(turn: number, players: Array<PlayerObject>, biggestBet: number, tableMoney: number, playerWithBiggestBet: NumOrNull, stage: Stage, pot: number) => {

    abilityToMove.current = false;

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
    // abilityToMove.current = true;

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
      abilityToMove.current = true;
      
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
        console.log('winners: ', winners);
        resetGameState(playersCopy);
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

  // 

  const resetRoundState = (players: Array<PlayerObject>) => {
    // setPot(() => pot + tableMoney);
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
    return newPlayers;
  }

  const resetGameState = async (players: Array<PlayerObject>) => {
    
      let playersCopy = players.map((player) => {
        return {
          ...player,
          cards: [...player.cards],
          evaledHand: {} as EvaledHand,
          hasFolded: false,
          bet: 0,

        }
      });

      const newDeck = shuffleCards(baseDeck);

      for (let player of playersCopy) {
         if (player.money > 0) player.cards = [newDeck.pop() as string, newDeck.pop() as string];
      }

      const newCurrentDealerId = getNextTurn(currentDealerId as number, playersCopy);

      console.log('new current dealer id: ', newCurrentDealerId)

      playersCopy = giveBlind(playersCopy, 1, newCurrentDealerId);

  
      await sleep(5000);
      setCardsVisible(() => false);
      await sleep(1000);
      setInitialValues(playersCopy, 1, newCurrentDealerId);
      let newTurn = getNextTurn(newCurrentDealerId, playersCopy);
      while (playersCopy[newTurn].bet > 0) {
        newTurn = getNextTurn(newTurn, playersCopy);
      }
      await sleep(1000);
      setTurn(() => newTurn);
      setCardsAreDealt(false);
      // setCardsAreDealt(() => false);

  }

  const checkIfOnePlayerLeft = (players: Array<PlayerObject>) => {
    let brokePlayers = 0;
    for (let player of players) {
      if (player.money === 0) brokePlayers++;
    }

    if (brokePlayers === players.length - 1) {
      return true;
    }
  }

  const checkIfUserLoses = (players: Array<PlayerObject>) => {
    return players[0].money === 0;
  }



  const checkIfCardsShouldBeDealt = (
    turn: number, 
    stage: Stage, 
    tableMoney: number,
    playerWithBiggestBet: NumOrNull,
    playerThatBegins: number,
    ) => {
      return (turn === playerWithBiggestBet || (!tableMoney && turn === playerThatBegins));
  }

  const getNextTurn = (turn: number, players: Array<PlayerObject>) => {
    let newTurn = turn === players.length - 1 ? 0 : turn + 1;

    // Maybe I should add a variable hasLost to player object
    while (players[newTurn]?.hasFolded || players[newTurn]?.money === 0) {
      newTurn = newTurn === players.length - 1 ? 0 : newTurn + 1;
    }

    return newTurn;
  }

  const getPreviousTurn = (turn: number, players: Array<PlayerObject>) => {
    let newTurn = turn === 0 ? players.length - 1 : turn - 1;

    while (players[newTurn]?.hasFolded || players[newTurn]?.money === 0) {
      newTurn = newTurn === 0 ? players.length - 1 : newTurn - 1;
    }

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

    let currentAction = newPlayers[turn].action;

    if (currentAction === 'CALL') {
      currentAction = 'call';
    } else if (currentAction === 'call') {
      currentAction = 'CALL';
    } else {
      currentAction = 'CALL';
    }

    player.action = currentAction;
    // setPlayers(() => newPlayers);
    setTableMoney(() => tableMoney + moneyToCall);
    setPot(() => pot + moneyToCall);
   
    return newPlayers;
  }

  const check = (turn: number, players: Array<PlayerObject>, playerWithBiggestBet: NumOrNull, stage: Stage) => {

    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
        }
    });

    let currentAction = newPlayers[turn].action;

    if (currentAction === 'CHECK') {
      currentAction = 'check';
    } else if (currentAction === 'check') {
      currentAction = 'CHECK';
    } else {
      currentAction = 'CHECK';
    }

    newPlayers[turn].action = currentAction;

    // newPlayers[turn].action = 'CHECK';

    return newPlayers;
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

    const playerCards: Array<string> = [...player.cards];
    if (!communityCards.length) {
      // Here I have to make a pseudo card so that the server can evaluate the hand (it can't evaluate 2 cards hand)
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

    setWinners(() => highestHands);

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
      // const moneyToGive = Math.floor(moneyLeft / winners.length);
      for (let i = 0; i < winners.length; i++) {
        newPlayers[winners[i]].money += moneyLeft;
      }
    }
    
    return newPlayers;
  }

  const createPlayers = (deck: Array<string>, numOfPlayers: number) => {
    const newDeck = [...deck];
    const actions: Array<boolean> = [];
    const newPlayers: Array<PlayerObject> = [];
    for (let i = 0; i < numOfPlayers; i++) {
      let playerCards = [newDeck.pop(), newDeck.pop()];
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        money: 1000,
        cards: playerCards as Array<string>,
        action: '-',
        evaledHand: {} as EvaledHand,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0,
        hasFolded: false,
      })
      actions.push(false);
    }
    setDeck(() => newDeck);
    return newPlayers;
  }

  // Function that starts the game
  const initializeGame = (deck: Array<string>) => {
    const newDeck = [...deck]
    const newPlayers: Array<PlayerObject> = giveBlind(createPlayers(newDeck, 4), 1, currentDealerId as number);
    let newTurn = getNextTurn(currentDealerId as number, newPlayers);
    while (newPlayers[newTurn].bet > 0) {
      newTurn = getNextTurn(newTurn, newPlayers);
    }
    setPlayers(() => newPlayers);
    setInitialValues(newPlayers, 1, currentDealerId as number);
    setGameInitialized(() => true);
    setTurn(() => newTurn);
    setCardsAreDealt(() => false);
  }

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div onClick={() => {
              console.log('player that begins: ', playerThatBegins);
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
                action={player.action}
                // actionVisible={actionVisibility[player.id]}
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
            if (turn === 0 && abilityToMove.current) {
              const newPlayers = check(turn as number, players, playerWithBiggestBet, currentStage);
              makeUserMove(turn as number, newPlayers, biggestBet, tableMoney, playerWithBiggestBet, currentStage, pot)
            };
          }} className={styles.playerBtn}>Check</button>
          <button onClick={() => {
            if (turn === 0 && abilityToMove.current) {
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