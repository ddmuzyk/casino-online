import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";
import Image from "next/image";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = ({id, name, turn, money, cards}) => {

  const classname = `player${id}`;

  return (
    <div className={`${styles[classname]} ${styles['player-container']}`}>
      <p className={styles.container}>Player</p>
      <div>
        {cards.map((card: string) => {
          return <Image key={card} src={`/svg-cards/${card}.svg`} alt="Playing card" width={77} height={154}></Image>
        })}
      </div>
    </div>
  )
}

export default Player;