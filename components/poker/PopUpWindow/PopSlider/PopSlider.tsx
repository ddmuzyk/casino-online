import './PopSlider.scss';

const PopSlider = () => {
  return (
    <div className="slider-container">

      <input type="range" min="1" max="100001" step="1000" className="slider" id="myRange"></input>
    </div>
  )
}

export default PopSlider;
