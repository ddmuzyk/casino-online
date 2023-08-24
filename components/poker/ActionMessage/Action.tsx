import React, { useState, useEffect } from 'react';
import styles from './Action.module.scss';
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface ActionMessageProps {
  action: string
}

const ActionMessage: React.FC<ActionMessageProps> = ({action}) => {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }
    , 2000)
  }, [action])
  

  return (
    <div>
      <CSSTransition
      in={isVisible}
      appear={true}
      timeout={1000}
      classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
        appearDone: styles.appearDone,
        enter: styles.enter,
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exit: styles.exit,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
      }}
      >
        <p className={styles.action}>{`${action}`}</p>
      </CSSTransition>
    </div>
  )
}

export default ActionMessage;