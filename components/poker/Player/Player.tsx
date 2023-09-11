import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";
import { CSSTransition, TransitionGroup, SwitchTransition } from "react-transition-group";
import Image from "next/image";
import ActionMessage from "../ActionMessage/Action";

// interface PlayerProps {
//   state: object
// }

const Player: React.FC<PlayerObject>  = ({id, name, turn, money, cards, action, smallBlind, bigBlind, bet, biggestBet, cardsAreDealt, won, currentDealerId}) => {


  const classname = `player${id}`;
  const actionClass = `action${id}`;
  // console.log('player: ', biggestBet)
  // const turnBackground = turn === id ? 'turn' : '';

  return (
    <div className={`${styles[classname]}`}>
        {id === 3 ? <p className={styles.bet} style={{bottom: "30px", width:"10px"}}>{bet}$</p> : null}
        {id === 0 ? <p className={styles.bet}>{bet}$</p> : null}
      <div className={`${styles['player-container']}`}
      // style={{height: id === 2 ? "230px" : "200px"}}
      >
        <div className={styles['imgs-container']}>
          {cards.map((card: string, i) => {
            return (
              <img onClick={() => {console.log(biggestBet)}} 
                className={`${styles.image} ${turn === id && !cardsAreDealt ? styles.turn : ""}  ${won ? styles.won : ""}`} 
                key={`${card}`} 
                src={card !== 'null' ? `/svg-cards/${card}.svg` : "/svg-cards/backside.svg"} 
                alt="Playing card" 
                width={77} 
                height={154}>
              </img>
            )
          })}
        </div>
        <div className={styles.stats}>
          <p className={styles.container}>Player{id} <span>{money}$ <span className={styles.dealerBtn}>{id === currentDealerId ? "D" : null}</span></span></p>
        </div>
        {id === 2 ? <p className={styles.bet}>{bet}$</p> : null}
        {/* {id !== 2 ? <ActionMessage action={action}/> : null} */}
        <ActionMessage action={action}/>
      </div>
      {id === 1 ? <p className={styles.bet} style={{bottom: "30px", width: '10px'}}>{bet}$</p> : null}
      {/* {id === 2 ? <ActionMessage action={action}/> : null} */}
    </div>
  )
}

export default Player;