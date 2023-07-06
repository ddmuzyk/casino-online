import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";
import Image from "next/image";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = ({id, name, turn, money, cards, smallBlind, bigBlind}) => {

  const classname = `player${id}`;

  return (
    <div className={`${styles[classname]} ${styles['player-container']}`}>
      <div className={styles['imgs-container']}>
        {cards.map((card: string) => {
          return <Image className={styles.image} key={card} src={`/svg-cards/${card}.svg`} alt="Playing card" width={77} height={154} priority={true}></Image>
        })}
      </div>
      <div className={styles.stats}>
        <p className={styles.container}>Player{id} {money}$</p>
      </div>
    </div>
  )
}

export default Player;