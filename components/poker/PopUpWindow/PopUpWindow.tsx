import styles from './PopUpWindow.module.scss';
import { cards, shuffleCards } from '@/lib/poker/poker-logic/poker';
import Link from 'next/link';


type PopUpWindowProps = {
  userWon: boolean,
  gameInitialized: boolean,
  initializeGame: any,
  username?: string,
  money?: number,
}

const PopUpWindow: React.FC<PopUpWindowProps> = ({userWon, gameInitialized , initializeGame}) => {
  if (!gameInitialized) {
    return (
      <div className={styles.popUpWindow}>
        <h2 className={styles.title}>
          Hello
        </h2>
        <p className={styles.result}>
          Welcome to the game.
        </p>
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