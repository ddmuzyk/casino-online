import React, {useState} from "react";

interface SliderProps {
  step: string
}

const Slider: React.FC<SliderProps> = ({step}) => {
  const [value, setValue] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  }

  return (
    <div>
      <input type="range" min="0" max="100" step={step} value={value} onChange={handleChange}/>
      <p>{value}</p>
    </div>
  )
}

export default Slider;