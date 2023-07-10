import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";
import Image from "next/image";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = ({id, name, turn, money, cards, smallBlind, bigBlind, bet, biggestBet}) => {

  const classname = `player${id}`;
  console.log('player: ', biggestBet)

  return (
    <div className={`${styles[classname]}`}>
      {id === 1 || id === 4 ? <p className={styles.bet}>{bet}$</p> : null}
      <div className={`${styles['player-container']}`}>
        <div className={styles['imgs-container']}>
          {cards.map((card: string) => {
            return <Image className={styles.image} key={card} src={`/svg-cards/${card}.svg`} alt="Playing card" width={77} height={154} priority={true}></Image>
          })}
        </div>
        <div className={styles.stats}>
          <p className={styles.container}>Player{id} {money}$</p>
        </div>
      </div>
      {id === 2 || id === 3 ? <p className={styles.bet}>{bet}$</p> : null}
    </div>
  )
}

export default Player;