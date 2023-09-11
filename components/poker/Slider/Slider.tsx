import React, {useState} from "react";
import styles from './Slider.module.scss';

interface SliderProps {
  step: string,
  max: number,
  betValue: string,
  setBetValue: React.Dispatch<React.SetStateAction<string>>
}

const Slider: React.FC<SliderProps> = ({step, max, betValue, setBetValue}) => {
  // const [value, setValue] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetValue(e.target.value);
  }

  return (
    <div>
      <input className={styles.input} type="range" min="0" max={max} step={step} value={betValue} onChange={handleChange}/>
      <p className={styles.value}>{betValue}$</p>
    </div>
  )
}

export default Slider;