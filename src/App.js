import './App.css';
import React, { useState } from 'react';

function App() {

  const [min, setMin] = useState(0);
  const [max, setmax] = useState(0);
  const [result, setResult] = useState(0);

  const handleRandom = function () {
    setResult(Number(randomInt(min, max)));
  };

  const onChange = function (e) {
    if (e.target.id === 'min') {
      setMin(Number(e.target.value));
    } else if (e.target.id === "max") {
      setmax(Number(e.target.value));
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="result">
          <p>
            Random number: <span>{result}</span>
          </p>
        </div>
        <div className="option">
          <div>
            <p>
              Min
          </p>
            <input id="min" type="number" value={min} onChange={onChange} />
          </div>
          <div>
            <p>
              Max
          </p>
            <input id="max" type="number" value={max} onChange={onChange} />
          </div>
        </div>
        <div className="button">
          <button onClick={handleRandom} >
            Random
          </button>
        </div>
      </div>
    </div>
  );
}

function randomInt(minVal, maxVal) {
  let num = minVal + (Math.random() * (maxVal - minVal + 1));
  return Math.floor(num);
}

export default App;
