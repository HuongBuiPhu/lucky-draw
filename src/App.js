import './App.css';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

let items = [];
let eMin = 0, eMax = 0;

function App() {

  const [min, setMin] = useState(0);
  const [max, setmax] = useState(0);
  const [duplicate, setDuplicate] = useState(true);
  const [result, setResult] = useState(0);

  const handleRandom = function () {
    setResult(randomInList(items, duplicate));
    console.log(items);
  };

  const onChange = function (e) {
    if (e.target.id === 'min') {
      setMin(e.target.value);
      eMin = e.target.value;
    } else if (e.target.id === "max") {
      setmax(e.target.value);
      eMax = e.target.value;
    }

    items = [];
    if (eMax <= eMin) {
      items.push(eMin);
    } else {
      let i = eMin;
      while (i <= eMax) {
        items.push(i);
        i++;
      }
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
      console.log(d);
      items = [];
      d.forEach(element => {
        items.push(element.a);
      });
      console.log(items);
    });

  }

  return (
    <div className="App">
      <div className="container">
        <div className="input-file">
          <input type="file" onChange={handleInputFile} />
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
        <div className="check-duplicate">
          <input type="checkbox" defaultChecked={duplicate} onChange={() => setDuplicate(!duplicate)} />
          <label>Duplicate</label>
        </div>
        <div className="result">
          <p>
            Random number: <span>{result}</span>
          </p>
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

function randomInList(list, canDuplicate) {
  let size = list.length;
  let index = randomInt(0, size - 1);
  if (!canDuplicate) {
    return list.splice(index, 1);
  } else {
    return list[index];
  }
}

export default App;
