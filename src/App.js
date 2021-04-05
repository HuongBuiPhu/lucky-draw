import './App.css';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

let items = [];

function App() {

  const [min, setMin] = useState(0);
  const [max, setmax] = useState(0);
  const [result, setResult] = useState(0);

  const handleRandom = function () {
    //setResult(Number(randomInt(min, max)));
    setResult(Number(randomAndRemove(items)));
    console.log(items);
  };

  const onChange = function (e) {
    if (e.target.id === 'min') {
      setMin(Number(e.target.value));
    } else if (e.target.id === "max") {
      setmax(Number(e.target.value));
    }
  };

  const handleInputFile = function (e) {
    const path = e.target.files[0];
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(path);
      fileReader.onload = (err) => {
        const bufferArray = err.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      d.forEach(element => {
        items.push(element.__rowNum__);
      });
      console.log(items);
    });

  }

  return (
    // <>
    //   <Router>
    //     <NavBar />
    //     <Switch>
    //       <Route path="/" exact />
    //     </Switch>
    //   </Router>
    // </>
    <div className="App">
      <div className="container">
        <div className="input-file">
          <input type="file" onChange={handleInputFile} />
        </div>
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

function randomInList(list) {
  let size = list.length;
  let index = randomInt(0, size - 1);
  return list[index];
}

function randomAndRemove(list) {
  let size = list.length;
  let index = randomInt(0, size - 1);
  return list.splice(index, 1);
}

export default App;
