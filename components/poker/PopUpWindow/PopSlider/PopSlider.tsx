import './PopSlider.scss';
import { useState, useContext } from 'react';
import { PokerContext, PokerContextProps } from '@/pages/game/poker';

interface PopSliderProps {
  chips: number,
  step: number,
  max: number,
  min: number,
}

const PopSlider: React.FC<PopSliderProps> = ({chips, step, max, min}) => {

  const [chipAmount, setChipAmount] = useState(chips);
  const [playerAmount, setPlayerAmount] = useState(1);

  const {numberOfPlayers, setNumberOfPlayers, smallBlind, setSmallBlind}: PokerContextProps = useContext(PokerContext);

  const handleChipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChipAmount(Number(e.target.value));
  }

  return (
    <div className="slider-container">
      <input type="range" min={min} max={max} step={step} className="slider" id="myRange"></input>
      <p>$</p>
    </div>
  )
}

export default PopSlider;
