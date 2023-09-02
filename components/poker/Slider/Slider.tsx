import React, {useState} from "react";
import styles from './Slider.module.scss';

interface SliderProps {
  step: string,
  max: number,
}

const Slider: React.FC<SliderProps> = ({step, max}) => {
  const [value, setValue] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  }

  return (
    <div>
      <input className={styles.input} type="range" min="0" max={max} step={step} value={value} onChange={handleChange}/>
      <p className={styles.value}>{value}$</p>
    </div>
  )
}

export default Slider;