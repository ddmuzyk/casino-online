import React, {use, useState, ReactNode} from "react";
import styles from './Player.module.scss';
import { PlayerObject } from "@/pages/game/poker";
import { CSSTransition, TransitionGroup, SwitchTransition } from "react-transition-group";
import Image from "next/image";
import ActionMessage from "../ActionMessage/Action";

const Player: React.FC<PlayerObject>  = ({id, name, turn, money, cards, action, smallBlind, bigBlind, bet, biggestBet, cardsAreDealt, won, currentDealerId, isShowdown, hasFolded, out}) => {


  const classname = `player${id}`;
  const actionClass = `action${id}`;

  return (
    <div className={`${styles[classname]}`}>
        {id === 3 ? <p className={styles.bet} style={{bottom: "30px", width:"10px"}}>{bet}$</p> : null}
        {id === 0 ? <p className={styles.bet}>{bet}$</p> : null}
      <div className={`${styles['player-container']}`}
      >
        <div className={styles['imgs-container']}>
          {cards.map((card: string, i) => {
            let source = '';
            if (id === 0) {
              source = `/svg-cards/${card}.svg`;
            } else {
              if (isShowdown && !out && !hasFolded) {
                source = `/svg-cards/${card}.svg`;
              } else {
                source = "/svg-cards/backside.svg";
              }
            }
            return (
              <div className={styles.imgContainer} key={`${card}`}>
                <img 
                  className={`${styles.image} ${turn === id && !cardsAreDealt ? styles.turn : ""}  ${won ? styles.won : ""}`} 
                  src={source} 
                  alt="Playing card" 
                  width={77} 
                  height={154}>
                </img>
                <div className={`${styles.overlay} ${hasFolded || out ? styles.visible : styles.hidden}`}></div>

              </div>
            )
          })}
        </div>
        <div className={styles.stats}>
          <p className={styles.container}>Player{id} <span>{money}$ <span className={styles.dealerBtn}>{id === currentDealerId ? "D" : null}</span></span></p>
        </div>
        {id === 2 ? <p className={styles.bet}>{bet}$</p> : null}
        <ActionMessage action={action}/>
      </div>
      {id === 1 ? <p className={styles.bet} style={{bottom: "30px", width: '10px'}}>{bet}$</p> : null}
    </div>
  )
}

export default Player;