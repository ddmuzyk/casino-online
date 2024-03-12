import React from 'react';
import styles from './PopUpWindow.module.scss';
import { cards, shuffleCards } from '@/lib/poker/poker-logic/poker';
import Link from 'next/link';
import PopSlider from './PopSlider/PopSlider';


type PopUpWindowProps = {
  userWon: boolean,
  gameInitialized: boolean,
  initializeGame: any,
  username: string,
  money: number,
}

const PopUpWindow: React.FC<PopUpWindowProps> = ({userWon, gameInitialized , initializeGame, username, money}) => {
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
            <PopSlider />
            <p>Choose the amount of chips</p>
          </div>
          <div className={styles.sliderContainer}>
            <PopSlider />
            <p>Number of oponents</p>
          </div>
        </div>
        <div className={styles.btnsContainer}>
          <button className={styles.btn} onClick={() => initializeGame(shuffleCards(cards))}>Play</button>
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