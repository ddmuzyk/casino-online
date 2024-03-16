import Link from "next/link";
import { ReactComponentElement, useState, useEffect, useRef, createContext} from "react";
import styles from './poker.module.scss';
import './poker.module.scss'
import Layout from "@/components/layout";
import Player from "@/components/poker/Player/Player";
import Slider from "@/components/poker/Slider/Slider";
import PopUpWindow from "@/components/poker/PopUpWindow/PopUpWindow";
import { shuffleCards, cards, decky, SUITS, VALUES } from "@/lib/poker/poker-logic/poker.ts";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { giveBlind } from "@/lib/poker/poker-logic/functions/blind";
import { getNextTurn, getPreviousTurn } from "@/lib/poker/poker-logic/functions/turns";
import { getEvaluation, assignEvaluations, giveMoneyToWinners, getArrayOfWinners, getResponse, getTheWinner } from "@/lib/poker/poker-logic/functions/evaluation";
import { check} from "@/lib/poker/poker-logic/functions/actions";
import { checkIfCardsShouldBeDealt, checkIfUserLoses, checkIfUserWins, getNumberOfPlayersInGame, getNumberOfActivePlayers, checkForPossibleAction, checkIfThereIsAWinner } from "@/lib/poker/poker-logic/functions/checks";
import { timeout, sleep } from "@/lib/poker/poker-logic/functions/sleep";
import { redirect } from "next/dist/server/api-utils";

export const getServerSideProps = async (context:any) => {
  const cookies = context.req.cookies;
  const payload = {
    cookies,
    action: {
      type: 'lookup'
    }
  }
  try {
    let data = await fetch('http://localhost:3000/takemoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const response = await data.json();
    return {
      props: {
        data: response
      }
    }
  } catch (error) {
    console.error('Error: ', error);
    context.res.writeHead(302, { Location: '/' });
    context.res.end();
  }
}

export const PokerContext = createContext<PokerContextProps>({
  numberOfPlayers: 4,
  setNumberOfPlayers: () => {},
  smallBlind: 5,
  setSmallBlind: () => {},
  userMoney: 0,
  setUserMoney: () => {},
});

export interface PokerContextProps {
  numberOfPlayers: number,
  setNumberOfPlayers: any,
  smallBlind: number,
  setSmallBlind: any,
  userMoney: number,
  setUserMoney: any,
}

export interface Props {
  data: any
}

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
won: boolean,
out: boolean,
evaledHand?: EvaledHand,
biggestBet?: number,
currentDealerId?: number
turn?: NumOrNull,
cardsAreDealt?: boolean,
isShowdown?: boolean,

// biggestBet: number,
}

export interface EvaledHand {
  handName: string,
  handRank: number,
  handType: number,
  value: number,
}

export type Stage = 'pre-flop' | 'flop' | 'turn' | 'river';
export type NumOrNull = number | null;

const Poker: React.FunctionComponent<Props> = ({data}): JSX.Element => {

  const [gameInitialized, setGameInitialized] = useState(false); 
  const [baseDeck, setBaseDeck] = useState<Array<string>>(cards); 
  const [players, setPlayers] = useState<Array<PlayerObject>>([]); 
  const [activePlayers, setActivePlayers] = useState<Array<PlayerObject>>([]); 
  const [deck, setDeck] = useState(decky); 
  const [smallBlind, setSmallBlind] = useState<number>(5); 
  const [playerWithBigBlind, setPlayerWithBigBlind] = useState<number>(10); 
  const [currentDealerId, setCurrentDealerId] = useState<number>(1); 
  const [turn, setTurn] = useState<NumOrNull>(null); // Id of the player whose turn it is, randomly chosen at the start of the game
  const [communityCards, setCommunityCards] = useState<Array<string>>([]);
  const [cardsVisible, setCardsVisible] = useState(true); 
  const [currentStage, setCurrentStage] = useState<Stage>('pre-flop'); 
  const [isShowdown, setIsShowdown] = useState(false); 
  const [cardsAreDealt, setCardsAreDealt] = useState(true); 
  const [isComputerMove, setIsComputerMove] = useState(turn === 0 ? false : true);
  const [actionVisibility, setActionVisibility] = useState<Array<boolean>>([]); 
  const [betValue, setBetValue] = useState("0"); 
  const [numberOfPlayers, setNumberOfPlayers] = useState(3); 
  const [gameOver, setGameOver] = useState(false); 
  const [userWon, setUserWon] = useState(false); 
  const [userMoney, setUserMoney] = useState(() => {
    let half = Math.floor(data.money/4);
    let modulo = half % 100;
    return half - modulo;
  });

  const abilityToMove = useRef(true); 
  const biggestBet = useRef<number>(0); 
  const playerWithBiggestBet = useRef<NumOrNull>(null);
  const tableMoney = useRef<number>(0);
  const pot = useRef<number>(0);

  // useEffect(() => {
  //   console.log('user money changed to: ', userMoney);
  //   console.log('number of players changed to: ', numberOfPlayers);
  // }, [numberOfPlayers, userMoney]);

  useEffect(() => {
    // console.log('players changed to: ', players);
    if ((turn !== 0 && players.length && !cardsAreDealt)) startGameLoop(players, turn, currentStage,);
  }, [players, cardsAreDealt]);
  
  const setInitialValues = (players: Array<PlayerObject>, smallBlind: number, newCurrentDealerId: number) => {
    abilityToMove.current = true;
    setCurrentDealerId(() => newCurrentDealerId);
    // playerThatBegins.current = getNextTurn(newCurrentDealerId, players);
    const currentPot = players.reduce((acc, player) => acc + player.bet, 0);
    const currentBiggestBet = players.reduce((acc, player) => player.bet > acc ? player.bet : acc, 0);
    playerWithBiggestBet.current = null;
    pot.current = currentPot;
    tableMoney.current = currentPot;
    biggestBet.current = currentBiggestBet;
    setCommunityCards(() => []);
    setCardsVisible(() => true);
    setCurrentStage(() => 'pre-flop');
    setPlayers(() => players);
    setIsShowdown(() => false);
  }

  const setTurnAndPlayers = (players: Array<PlayerObject>, turn: number) => {
    setTurn(() => turn);
    setPlayers(() => players);
  }

  const makeUserMove = async(turn: number, players: Array<PlayerObject>, biggestBet: number, tableMoney: number, playerWithBiggestBet: NumOrNull, stage: Stage, pot: number) => {

    abilityToMove.current = false;

    let playersCopy = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    });

    let thereIsAWinner = checkIfThereIsAWinner(playersCopy);
    let actionIsPossible = checkForPossibleAction(playersCopy, biggestBet);

    if (thereIsAWinner) {
      await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible);
    } else if (!actionIsPossible) {
      await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible);
    } else {
  
      const nextTurn = getNextTurn(turn as number, players);
      const cardsShouldBeDealt = checkIfCardsShouldBeDealt(nextTurn, currentStage, tableMoney, playerWithBiggestBet, currentDealerId, playersCopy);
  
      if (cardsShouldBeDealt) {
        await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible); 
      } 
      else {
        setTurnAndPlayers(playersCopy, nextTurn);
      }
    }
  }
  
  const makeComputerMove = async(turn: number, players: Array<PlayerObject>, biggestBet: number, tableMoney: number, playerWithBiggestBet: NumOrNull, stage: Stage) => {

    const playersCopy = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
      }
    });
    const player = playersCopy[turn];
    
    const moneyToCall = biggestBet - player.bet;
    await sleep(1000);
    if (moneyToCall > 0) {
      return call(turn, playersCopy, biggestBet, moneyToCall, tableMoney);
    } else {
      return check(turn, playersCopy, playerWithBiggestBet, stage);  
    } 
  }
  
  const startGameLoop = async (
    players: Array<PlayerObject>, 
    turn: NumOrNull, 
    stage: Stage,
    ) => {
      
      abilityToMove.current = true;

      let playersCopy: Array<PlayerObject> = players.map((player) => {
        return {
          ...player,
          cards: [...player.cards],
          evaledHand: {...player.evaledHand as EvaledHand}
        }
      });

      if (turn && players.length > 0) {
        playersCopy = await makeComputerMove(turn as number, playersCopy, biggestBet.current, tableMoney.current, playerWithBiggestBet.current, stage);
      }

      let thereIsAWinner = checkIfThereIsAWinner(playersCopy);
      let actionIsPossible = checkForPossibleAction(playersCopy, biggestBet.current);

      if (thereIsAWinner) {
        await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible);
      } else if (!actionIsPossible) {
        await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible);
      } else {
        const nextTurn = getNextTurn(turn as number, players);
        const cardsShouldBeDealt = checkIfCardsShouldBeDealt(nextTurn, currentStage, tableMoney.current, playerWithBiggestBet.current, currentDealerId as number, playersCopy);
        if (cardsShouldBeDealt) {
          await onRoundEnd(playersCopy, stage, thereIsAWinner, actionIsPossible);
        } 
        else {
          setTurnAndPlayers(playersCopy, nextTurn);
        }
      }
      
  }

  const onRoundEnd = async (players: Array<PlayerObject>, stage: Stage, thereIsAWinner: boolean, actionIsPossible: boolean
    ) => {

      let playersCopy = players.map((player) => {
        return {
          ...player,
          cards: [...player.cards],
          evaledHand: {...player.evaledHand as EvaledHand}
        }
      });

      setBetValue(() => "0");

      if (thereIsAWinner) {
        setCardsAreDealt(() => true);
        const winner = getTheWinner(playersCopy) as Array<number>;
        playersCopy = giveMoneyToWinners(playersCopy, winner, pot.current);
        pot.current = 0;
        setTurn(() => null);
        setPlayers(() => playersCopy);
        resetGameState(playersCopy);
      } else if (stage === 'river') {
        setIsShowdown(() => true);
        setCardsAreDealt(() => true);
        const evaluations = await getEvaluation(playersCopy, communityCards);
        playersCopy = assignEvaluations(playersCopy, evaluations);
        setPlayers(() => playersCopy);
        await sleep(1000);
        const winners = getArrayOfWinners(playersCopy) ;
        playersCopy = giveMoneyToWinners(playersCopy, winners, pot.current);
        pot.current = 0;
        setTurn(() => null);
        setPlayers(() => playersCopy);
        resetGameState(playersCopy);
      } else if (!actionIsPossible) {
        setIsShowdown(() => true);
        if (stage === "river" as Stage) {
          const evaluations = await getEvaluation(playersCopy, communityCards);
          playersCopy = assignEvaluations(playersCopy, evaluations);
        }
        setCardsAreDealt(() => true);
        playersCopy = resetRoundState(playersCopy);
        setPlayers(() => playersCopy);
        setTurn(() => null);
        dealCommunityCards(communityCards, deck, currentStage);
        await sleep(1000);
        abilityToMove.current = true;
        setCardsAreDealt(() => false);
      } else {
        setCardsAreDealt(() => true);
        setPlayers(() => playersCopy);
        await sleep(1000);
        playersCopy = resetRoundState(playersCopy);
        setPlayers(() => playersCopy);
        const newCommunityCards = dealCommunityCards(communityCards, deck, currentStage);
        const evaluations = await getEvaluation(playersCopy, newCommunityCards);
        await sleep(1000);
        playersCopy = assignEvaluations(playersCopy, evaluations);
        setPlayers(() => playersCopy);
        setTurn(getNextTurn(currentDealerId as number, playersCopy));
        abilityToMove.current = true;
        setCardsAreDealt(() => false);
      }
  }

  const resetRoundState = (players: Array<PlayerObject>) => {
    tableMoney.current = 0;
    playerWithBiggestBet.current = null;
    biggestBet.current = 0;
    const newPlayers = players.map((player) => {
      return {
        ...player,
        bet: 0,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand},
        action: '',
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
          action: "",
          bet: 0,
          won: false,
        }
      });

      const newDeck = shuffleCards(baseDeck);
      for (let player of playersCopy) {
        if (player.money > 0) {
          player.cards = [newDeck.pop() as string, newDeck.pop() as string]
        }
        else {
          player.out = true;
        }
      }

      if (checkIfUserLoses(playersCopy[0])) {
        console.log('You lost');
        setTimeout(() => {
          setUserWon(() => false);
          setGameOver(() => true);
        }, 3000)
        return
      } else if (checkIfUserWins(playersCopy)) {
        console.log('You won');
        setTimeout(() => {
          setUserWon(() => true);
          setGameOver(() => true);
        }, 3000)
        return
      }

      // Add this to setInitialValues
      setDeck(() => newDeck);

      const newCurrentDealerId = getNextTurn(currentDealerId as number, playersCopy);
      const evaluations = await getEvaluation(playersCopy, []);
      playersCopy = assignEvaluations(giveBlind(playersCopy, smallBlind, newCurrentDealerId), evaluations);

      await sleep(5000);
      setCardsVisible(() => false);
      await sleep(1000);
      setInitialValues(playersCopy, smallBlind, newCurrentDealerId);
      let activePlayers = getNumberOfPlayersInGame(playersCopy);

      let newTurn = getNextTurn(newCurrentDealerId, playersCopy);
      if (activePlayers === 2) {
        newTurn = newCurrentDealerId as number;
      } else {
        while (playersCopy[newTurn].bet > 0) {
          newTurn = getNextTurn(newTurn, playersCopy);
        }
      }
      await sleep(1000);
      setTurn(() => newTurn);
      setCardsAreDealt(false);

  }

  // Call the biggest bet if the player has enough money, otherwise call all in
  const call = (turn: number , players: Array<PlayerObject>, biggestBet: number, moneyToCall: number, moneyOnTable: number) => {
    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
        }
    });
    if (playerWithBiggestBet.current === null) {
      playerWithBiggestBet.current = turn;
    }
    moneyToCall = moneyToCall > players[turn].money ? players[turn].money : moneyToCall;
    const player = newPlayers[turn];
    player.money -= moneyToCall;
    player.bet += moneyToCall;

    let currentAction = newPlayers[turn].action;

    if (currentAction === 'CALL') {
      currentAction = 'call';
    } else {
      currentAction = 'CALL';
    }

    player.action = currentAction;
    tableMoney.current = moneyOnTable + moneyToCall;
    pot.current = pot.current + moneyToCall;
   
    return newPlayers;
  }

  const fold = (turn: number, players: Array<PlayerObject>) => {
    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
        }
    });
  
    newPlayers[turn].hasFolded = true;
    
    if (newPlayers[turn].action === 'FOLD') {
      newPlayers[turn].action = 'fold';
    } else {
      newPlayers[turn].action = 'FOLD';
    }
  
    return newPlayers;
  }

  const playerRaise = (turn: number, players: Array<PlayerObject>, highestBet: number, moneyToRaise: string, moneyOnTable: number, currPot: number) => {
    
    let betValue = parseInt(moneyToRaise);
    
    const newPlayers = players.map((player) => {
      return {
        ...player,
        cards: [...player.cards],
        evaledHand: {...player.evaledHand as EvaledHand}
        }
    });

    
    const player = newPlayers[turn];
    
    if (betValue > player.money) {
      betValue = player.money;
    }

    if (player.action === 'RAISE') {
      player.action = 'raise';
    } else {
      player.action = 'RAISE';
    }

    player.money -= betValue;
    player.bet += betValue;
    tableMoney.current = moneyOnTable + betValue;
    pot.current = pot.current + betValue;
    biggestBet.current = player.bet;
    playerWithBiggestBet.current = turn;

    return newPlayers;
  }

  // Deal the flop, turn and river
  const dealCommunityCards = (communityCards: Array<string> , deck: Array<string>, stage: Stage) => {
    const deckCopy = [...deck];
    const communityCardsCopy = [...communityCards];
    const cardsToDeal = stage === 'pre-flop' ? 3 : stage === 'flop' || 'turn' ? 1 : 0;
    const nextStage = stage === 'pre-flop' ? 'flop' : stage === 'flop' ? 'turn' : stage === 'turn' ? 'river' : 'pre-flop';

    for (let i = 0; i < cardsToDeal; i++) {
      communityCardsCopy.push(deckCopy.pop() as string);
    }

    setCommunityCards(() => communityCardsCopy);
    setDeck(() => deckCopy);
    setCurrentStage(() => nextStage);

    return communityCardsCopy;

  }
  
  const createPlayers = (deck: Array<string>, numOfPlayers: number, username: string) => {
    const newDeck = [...deck];
    const newPlayers: Array<PlayerObject> = [];
    for (let i = 0; i < numOfPlayers; i++) {
      let playerCards = [newDeck.pop(), newDeck.pop()];
      let coins = 0
      if (i == 0) {
        coins = userMoney;
      } else if (i == 1 || i == 2) {
        coins = 500;
      } else {
        coins = 1000;
      }
      newPlayers.push({
        id: i,
        name: i === 0 ? username : `Player${i}`,
        money: coins,
        cards: playerCards as Array<string>,
        action: '',
        evaledHand: {} as EvaledHand,
        smallBlind: 0,
        bigBlind: 0,
        bet: 0,
        hasFolded: false,
        won: false,
        out: false,
      })
    }
    setDeck(() => newDeck);
    return newPlayers;
  }

  // Function that starts the game
  const initializeGame = async(deck: Array<string>) => {
    const newDeck = [...deck]
    let newPlayers: Array<PlayerObject> = giveBlind(createPlayers(newDeck, numberOfPlayers, data.name), smallBlind, currentDealerId as number);
    const evaluations = await getEvaluation(newPlayers, communityCards);
    newPlayers = assignEvaluations(newPlayers, evaluations);
    let newTurn = getNextTurn(currentDealerId as number, newPlayers);
    let activePlayers = getNumberOfPlayersInGame(newPlayers);
    if (activePlayers === 2) {
      newTurn = currentDealerId as number;
    } else {
      while (newPlayers[newTurn].bet > 0) {
        newTurn = getNextTurn(newTurn as number, newPlayers);
      }
    }
    setGameOver(() => false);
    setUserWon(() => false);
    setPlayers(() => newPlayers);
    setInitialValues(newPlayers, smallBlind, currentDealerId as number);
    setGameInitialized(() => true);
    setTurn(() => newTurn);
    setCardsAreDealt(() => false);
    // UNCOMMENT THIS TO START THE GAME
  }

  return (
    <PokerContext.Provider value={
      {
        numberOfPlayers,
        setNumberOfPlayers,
        smallBlind,
        setSmallBlind,
        userMoney,
        setUserMoney,
      }   
    }>
      <Layout siteTitle="Poker">
        <div className={styles.game}>
          {gameOver || !gameInitialized ? <PopUpWindow 
          userWon={userWon}
          gameInitialized={gameInitialized}
          initializeGame={initializeGame}
          username={data.name}
          money={data.money}
          /> : null}
          <div className={styles.tableContainer}>
            <div onClick={async () => {
                console.log(players);
                console.log(communityCards);
                console.log('table money: ', tableMoney.current);
              }} 
              className={styles.table}>
              <div className={styles.pot}>Pot: <span className={styles.potValue} key={pot.current}>{pot.current}$</span></div>
              <div className={`${styles.communityCards} ${cardsVisible ? "" : styles.communityCardsHidden}`}>
                {communityCards.map((card, id) => {
                  return (
                  <CSSTransition
                  in={communityCards.length > 0}
                  timeout={200}
                  classNames={{appearDone: styles.imageAppearDone, enterActive: styles.imageEnterActive, enterDone: styles.imageEnterDone, exit: styles.imageExit, exitActive: styles.imageExitActive, exitDone: styles.imageExitDone,}}
                  key={id}
                  appear={true}
                  >
                  <img className={`${styles.image}`} src={`/svg-cards/${card}.svg`} alt="community card" key={card}></img>
                  </CSSTransition>
                  )
                })} 
              </div>
                {players.map((player) => {
                  return <Player 
                  id={player.id} 
                  name={player.name}
                  money={player.money}
                  key={player.name}
                  cards={player.cards}
                  action={player.action}
                  won={player.won}
                  out={player.out}
                  smallBlind={player.smallBlind}
                  bigBlind={player.bigBlind}
                  bet={player.bet}
                  hasFolded={player.hasFolded}
                  biggestBet={biggestBet.current}
                  currentDealerId={currentDealerId as number}
                  turn={turn as number}
                  cardsAreDealt={cardsAreDealt}
                  isShowdown={isShowdown}
                />             
                })}
            </div>
          </div>
          <div className={styles.playerButtons}>
            <div>
              <button onClick={() => {
                if (turn === 0 && abilityToMove.current && !gameOver) {
                  const newPlayers = fold(turn as number, players,) as Array<PlayerObject>;
                  makeUserMove(turn as number, newPlayers, biggestBet.current, tableMoney.current, playerWithBiggestBet.current, currentStage, pot.current)
                }
              }
              } className={styles.playerBtn}>Fold</button>
            </div>
            <div>
              <button onClick={() => {
                if (turn === 0 && abilityToMove.current && players[0].bet === biggestBet.current && !gameOver) {
                  const newPlayers = check(turn as number, players, playerWithBiggestBet.current, currentStage);
                  makeUserMove(turn as number, newPlayers, biggestBet.current, tableMoney.current, playerWithBiggestBet.current, currentStage, pot.current)
                };
              }} className={styles.playerBtn}>Check</button>
            </div>
            <div>
              <button onClick={() => {
                if (turn === 0 && abilityToMove.current && players[0].bet < biggestBet.current && !gameOver) {
                  const newPlayers = call(turn as number, players, biggestBet.current, biggestBet.current - players[turn as number].bet, tableMoney.current)
                  makeUserMove(turn as number, newPlayers, biggestBet.current, tableMoney.current, playerWithBiggestBet.current, currentStage, pot.current)
                }
              }} className={styles.playerBtn}>Call</button>
            </div>
            <div>
              <button onClick={() => {
              if (turn === 0 && abilityToMove.current && parseInt(betValue) + players[0].bet > biggestBet.current && !gameOver) {
                setBetValue(() => "0");
                const newPlayers = playerRaise(turn as number, players, biggestBet.current, betValue, tableMoney.current, pot.current);
                makeUserMove(turn as number, newPlayers, biggestBet.current, tableMoney.current, playerWithBiggestBet.current, currentStage, pot.current)
              }
            }}
              className={styles.playerBtn}>Raise</button>
              <Slider 
              step={smallBlind.toString()}
              max={players[0]?.money ? players[0].money : 1000}
              betValue={betValue}
              setBetValue={setBetValue}
              />
            </div>
          </div>
        </div>
      </Layout>
  </PokerContext.Provider>
  )
}

export default Poker;