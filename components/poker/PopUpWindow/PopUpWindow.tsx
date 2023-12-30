import styles from './PopUpWindow.module.scss';
import { cards, shuffleCards } from '@/lib/poker/poker-logic/poker';
import Link from 'next/link';


type PopUpWindowProps = {
  userWon: boolean,
  initializeGame: any,
}

const PopUpWindow: React.FC<PopUpWindowProps> = ({userWon, initializeGame}) => {
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

export default PopUpWindow;