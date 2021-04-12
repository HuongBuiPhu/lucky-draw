import './App.css';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { Howl } from 'howler';
import reward from './resources/reward.mp3';
import LoadingAnim from './components/LoadingAnim';
import confetti from 'canvas-confetti';
import Header from './components/Header';

let items = [];
let eMin = 0, eMax = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      min: 0,
      max: 0,
      result: 0,
      loading: true,
      disableButton: false,
      background: 1.0,
      inputFile: false,
    };

    this.soundEff = new Howl({
      src: [reward],
      loop: false,
      volume: 1.0,
      html5: true
    });

    this.rDivRect = { x: 0, y: 0, width: 0, height: 0 };

    this.handleRandom = this.handleRandom.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleInputFile = this.handleInputFile.bind(this);
    this.onChangeInputType = this.onChangeInputType.bind(this);
  }

  handleRandom = function () {
    this.setState({
      result: "",
      disableButton: true,
      background: 0.3
    });
    let timeout = randomInt(40, 80);
    setTimeout(() => {
      this.setState({
        result: randomInList(items, Header.dup),
        disableButton: false,
        background: 1.0
      });

      let canvas = document.getElementById("confetti");
      canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
      canvas.confetti({
        particleCount: 130,
        spread: 60,
        origin: { y: 1.0 },
        startVelocity: 20,
      });

      if (Header.eff) {
        this.soundEff.play();
      }

      console.log(items);
    }, timeout * 100);

    this.rDivRect = document.getElementById("result").getBoundingClientRect();
  };

  onChange = function (e) {
    if (e.target.id === 'min') {
      this.setState({
        min: e.target.value
      });
      eMin = parseInt(e.target.value);
    } else if (e.target.id === "max") {
      this.setState({
        max: e.target.value
      });
      eMax = parseInt(e.target.value);
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

  handleInputFile = function (e) {
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
    });
  }

  onChangeInputType = function (e) {
    this.setState({
      inputFile: e
    })
  }

  render() {
    return (
      <div className="App">
        <Header updateInputType={this.onChangeInputType} />
        <div className="container">
          {this.state.inputFile ?
            <div className="input-file">
              <input type="file" onChange={this.handleInputFile} />
            </div> :
            <div className="option">
              <div>
                <p>Min</p>
                <input id="min" type="number" value={this.state.min} onChange={this.onChange} />
              </div>
              <div>
                <p>Max</p>
                <input id="max" type="number" value={this.state.max} onChange={this.onChange} />
              </div>
            </div>
          }
          <div className="result-container" style={{ position: "relative" }}>
            <canvas id="confetti" className="confetti" width={this.rDivRect.width} height={this.rDivRect.height}
              style={{ position: "absolute", zIndex: 1 }} />
            <div id="result" className="result">
              <p>
                {this.state.result === "" ? <LoadingAnim /> : this.state.result}
              </p>
            </div>
          </div>
          <div className="button">
            <button disabled={this.state.disableButton} style={{ opacity: this.state.background }} onClick={this.handleRandom} >
              Random
          </button>
          </div>
        </div>
      </div>
    );
  }
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
