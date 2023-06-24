import React, {use, useState} from "react";
import styles from './Player.module.scss';

const Player = () => {

  const [money, setMoney] = useState(1000);

  return (
    <div className={styles.player1}>
      <p className={styles.container}>Player</p>
    </div>
  )
}

export default Player;