import './App.css';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { Howl } from 'howler';
import reward from './resources/reward.mp3';
import LoadingAnim from './components/LoadingAnim';
import confetti from 'canvas-confetti';
import Header from './components/Header';

let items = [];
let ratio = [];
let res = [];
let sum = 0;
let eMin = 0, eMax = 0;
let numRandom = 1;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: "Result",
      loading: true,
      disableButton: false,
      background: 1.0,
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
    this.onChangeNumRandom = this.onChangeNumRandom.bind(this);
  }

  handleRandom = function () {
    res = [];
    if (items.length <= 0) {
      this.setState({
        result: "Empty range!"
      })
      return;
    }

    this.setState({
      result: "",
      disableButton: true,
      background: 0.3
    });

    let timeout = randomInt(30, 70);
    for (let i = 0; i < numRandom; i++) {
      res.push(randomByWeight(Header.dup));
      console.log(res);
      setTimeout(() => {
        this.setState({
          result: i > 0 ? this.state.result + '  -  ' + res[i] : res[i],
        });

        if (Header.eff) {
          this.soundEff.play();
        }
      }, timeout * 100);
      timeout += 8;
    }

    timeout -= 8;
    setTimeout(() => {
      this.setState({
        disableButton: false,
        background: 1.0
      });
      if (Header.eff) {
        let canvas = document.getElementById("confetti");
        canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });
        // canvas.confetti({
        //   particleCount: 150,
        //   spread: 80,
        //   origin: { y: 0.75 },
        //   startVelocity: 20,
        //   ticks: 75
        // });
        createConfetti(canvas);
      }
      console.log(items);
    }, timeout * 100);

    this.rDivRect = document.getElementById("result").getBoundingClientRect();
  };

  onChange = function (id, value) {
    if (id === 'min') {
      eMin = parseInt(value);
    } else if (id === "max") {
      eMax = parseInt(value);
    }

    items = [];
    ratio = [];
    sum = 0;
    if (eMax <= eMin) {
      items.push(eMin);
      ratio.push(1);
      sum = 1;
    } else {
      let i = eMin;
      while (i <= eMax) {
        items.push(i);
        ratio.push(1);
        sum++;
        i++;
      }
    }
  };

  onChangeNumRandom = function (value) {
    numRandom = parseInt(value);
    if (numRandom < 1)
      numRandom = 1;
  }

  handleInputFile = function (e) {
    const file = e.target.files[0];
    console.log(file);
    if (!file) {
      this.setState({
        result: "Invalid file!"
      })
      return;
    }
    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xlsm")) {
      this.setState({
        result: "Invalid file!"
      })
      return;
    }
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (err) => {
        const bufferArray = err.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      console.log(d);
      items = [];
      ratio = [];
      sum = 0;
      d.forEach(element => {
        items.push(element[0]);
        let r = 1;
        if (element[1]) {
          r = parseInt(element[1]);
        }
        ratio.push(r);
        sum += r;
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header onChangeNumberValue={this.onChange} onInputFile={this.handleInputFile}
          onChangePrize={this.onChangeNumRandom} />
        <div className="container">
          <div className="result-container">
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

function randomByWeight(canDuplicate) {
  let weigth = randomInt(1, sum);
  let index = 0;
  for (index = 0; index < ratio.length; index++) {
    weigth -= ratio[index];
    if (weigth <= 0)
      break;
  }
  if (canDuplicate) {
    return items[index];
  } else {
    sum -= ratio.splice(index, 1)[0];
    return items.splice(index, 1)[0];
  }
}

function randomInList(list, canDuplicate) {
  let size = list.length;
  let index = randomInt(0, size - 1);
  if (!canDuplicate) {
    return list.splice(index, 1)[0];
  } else {
    return list[index];
  }
}

function createConfetti(canvas) {
  var colors = ['#bb0000', '#ffffff'];

  canvas.confetti({
    particleCount: 200,
    angle: 45,
    spread: 80,
    origin: { x: 0.1, y: 0.9 },
    ticks: 75
  });
  canvas.confetti({
    particleCount: 200,
    angle: 135,
    spread: 80,
    origin: { x: 0.9, y: 0.9 },
    ticks: 75
  });
}

export default App;
