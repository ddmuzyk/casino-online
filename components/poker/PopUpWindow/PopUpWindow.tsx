import React, {useContext} from 'react';
import styles from './PopUpWindow.module.scss';
import { cards, shuffleCards } from '@/lib/poker/poker-logic/poker';
import Link from 'next/link';
import PopSlider from './PopSlider/PopSlider';
import { PokerContext, PokerContextProps } from '@/pages/game/poker';
import { user } from '@nextui-org/react';
import { makeTransaction } from '@/lib/poker/poker-logic/functions/requests';


type PopUpWindowProps = {
  userWon: boolean,
  gameInitialized: boolean,
  initializeGame: any,
  username: string,
  money: number,
}


const PopUpWindow: React.FC<PopUpWindowProps> = ({userWon, gameInitialized , initializeGame, username, money}) => {

  const {numberOfPlayers, setNumberOfPlayers, smallBlind, setSmallBlind, userMoney, setUserMoney}: PokerContextProps = useContext(PokerContext);
  
  if (!gameInitialized) {
    return (
      <div className={styles.popUpWindow}>
        <h2 className={styles.title}>
          Hello
        </h2>
        <p className={styles.result}>Welcome to the game, <span className={styles.bold}>{username}</span>.</p>
        <p className={styles.result}>You have <span className={styles.bold}>{money}</span> coins.</p>
        <div className={styles.slidersContainer}>
          <div className={styles.sliderContainer}>
            <PopSlider chips={money} step={100} max={money/2} min={100} type='chip'/>
            <p>Choose the amount of chips</p>
          </div>
          <div className={styles.sliderContainer}>
            <PopSlider chips={money} step={1} max={3} min={1} type='opponent'/>
            <p>Number of oponents</p>
          </div>
        </div>
        <div className={styles.btnsContainer}>
          <button className={styles.btn} onClick={async () => {
            const response = await makeTransaction('update' ,true, userMoney, money);
            if (response === 'Success') {
              initializeGame(shuffleCards(cards))
            } else {
              console.log('Error: ', response)
            }
          }
          }>Play</button>
          <Link href='/' className={styles.btn}>
            Exit
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.popUpWindow}>
        <h2 className={styles.title}>
          {userWon ? "Congrats!" : "Game Over"}
        </h2>
        <p className={styles.result}>
          {userWon ? "You won the game!" : "You lost all your money"}
        </p>
        <div className={styles.btnsContainer}>
          <button className={styles.btn} onClick={() => initializeGame(shuffleCards(cards))}>Play again</button>
          <Link href='/' className={styles.btn}>
            Exit
          </Link>
        </div>
      </div>
    )
  }
}

export default PopUpWindow;