import React, {useState} from "react";
import styles from './Slider.module.scss';

interface SliderProps {
  step: string,
  max: number,
  betValue: string,
  setBetValue: React.Dispatch<React.SetStateAction<string>>,
}

const Slider: React.FC<SliderProps> = ({step, max, betValue, setBetValue}) => {
  // const [value, setValue] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetValue(e.target.value);
  }

  


  return (
    <div>
      <input className={styles.input} type="range" min="0" max={max} step={step} value={betValue} onChange={handleChange}/>
      <div className={styles.valuesContainer}>
        <p className={styles.value}>{betValue}$</p>
        <span className={styles.row}>
          <p className={`${styles.value} ${styles.btn}`} onClick={() => setBetValue(String(parseInt(betValue) - parseInt(step)))}>-</p>
          <p className={`${styles.value} ${styles.btn}`} onClick={() => setBetValue(String(parseInt(betValue) + parseInt(step)))}>+</p>
        </span>
      </div>
    </div>
  )
}

export default Slider;