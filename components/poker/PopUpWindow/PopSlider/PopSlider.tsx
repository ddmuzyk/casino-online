import './PopSlider.scss';
import { useState } from 'react';

interface PopSliderProps {
  chips: number,
  step: number,
  max: number,
  min: number,
}

const PopSlider: React.FC<PopSliderProps> = ({chips, step, max, min}) => {

  const [chipAmount, setChipAmount] = useState(chips);
  const [playerAmount, setPlayerAmount] = useState(1);

  // const handleChipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setChipAmount(e.target.value);
  // }

  return (
    <div className="slider-container">
      <input type="range" min={min} max={max} step={step} className="slider" id="myRange"></input>
      <p>$</p>
    </div>
  )
}

export default PopSlider;
