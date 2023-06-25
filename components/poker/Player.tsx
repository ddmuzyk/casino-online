import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = (player) => {

  const classname = `${styles.player}`

  return (
    <div className={styles.player1}>
      <p className={styles.container}>Player</p>
    </div>
  )
}

export default Player;