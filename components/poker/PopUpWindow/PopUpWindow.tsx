import styles from './PopUpWindow.module.scss';

type PopUpWindowProps = {
  gameOver: boolean
}

const PopUpWindow: React.FC<PopUpWindowProps> = ({gameOver}) => {
  return (
    <div className={styles.popUpWindow}>
      <h2 className={styles.title}>
        {gameOver ? "Game Over" : "Congrats!"}
      </h2>
      <p className={styles.result}>
        {gameOver ? "You lost all your money" : "You won the game!"}
      </p>
      <div className={styles.btnsContainer}>
        <button className={styles.btn}>Play again</button>
        <button className={styles.btn}>Exit</button>
      </div>
    </div>
  )
}

export default PopUpWindow;