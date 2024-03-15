import './PopSlider.scss';
import { useState, useContext } from 'react';
import { PokerContext, PokerContextProps } from '@/pages/game/poker';

interface PopSliderProps {
  chips: number,
  step: number,
  max: number,
  min: number,
  type: 'chip' | 'opponent'
}

const PopSlider: React.FC<PopSliderProps> = ({chips, step, max, min, type}) => {

  const [chipAmount, setChipAmount] = useState(() => {
    let half = Math.floor(chips/4);
    let modulo = half % 100;
    return half - modulo;
  });
  const [opponentAmount, setOpponentAmount] = useState(2);

  const {numberOfPlayers, setNumberOfPlayers, smallBlind, setSmallBlind, userMoney, setUserMoney}: PokerContextProps = useContext(PokerContext);

  const handleChipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'chip') {
      setChipAmount(parseInt(e.target.value));
      setUserMoney(parseInt(e.target.value));
    } else if (type === 'opponent') {
      setOpponentAmount(parseInt(e.target.value));
      setNumberOfPlayers(parseInt(e.target.value)+1);
    }
  }

  return (
    <div className="slider-container">
      <input onChange={(e) => handleChipChange(e)} type="range" min={min} max={max} step={step} value={type === 'chip' ? chipAmount : opponentAmount} className="slider" id="myRange"></input>
      <p>{type === 'chip' ? `${chipAmount}$` :
      type === 'opponent' ? `${opponentAmount}` : ''
      }</p>
    </div>
  )
}

export default PopSlider;
