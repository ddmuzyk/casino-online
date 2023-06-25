import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = ({id, name, turn, money}) => {

  const classname = `player${id}`;

  return (
    <div className={styles[classname]}>
      <p className={styles.container}>Player</p>
    </div>
  )
}

export default Player;