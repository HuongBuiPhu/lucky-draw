import './App.css';
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { Howl } from 'howler';
import xoso from './resources/xo-so-original.mp3';
import xoso2 from './resources/xo-so-remix-dan-tranh.mp3';

let items = [];
let eMin = 0, eMax = 0;
let currSound = 1;

const audioClips = [
  { sound: xoso, label: 'Xo-so', index: 0 },
  { sound: xoso2, label: 'Xo-so-2', index: 1 }
];

// const audios = [
//   { sound: new Howl({ src: [xoso], loop: true, volume: 1.0 }), name: 'original', index: 0 },
//   { sound: new Howl({ src: [xoso2], loop: true, volume: 1.0 }), name: 'remix', index: 1 },
// ]

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      min: 0,
      max: 0,
      duplicate: true,
      result: 0,
      music: currSound,
      playing: false,
      loading: true,
    }

    this.handleRandom = this.handleRandom.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleInputFile = this.handleInputFile.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.onChangeMusic = this.onChangeMusic.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }

  playAudio = function (audioClip, isPlay) {
    if (!isPlay) {
      if (this.sound)
        this.sound.pause();
      return;
    }

    if (this.sound) {
      if (currSound === audioClip.index) {
        this.sound.play();
        return;
      } else {
        this.sound.stop();
        delete this.sound;
      }
    }
    this.sound = new Howl({
      src: [audioClip.sound],
      loop: true,
      volume: 1.0,
      html5: true
    });
    this.sound.play();
    currSound = audioClip.index;
  }

  onChangeMusic = function (e) {
    this.setState({
      music: e.target.value
    });
    if (this.state.playing)
      this.playAudio(audioClips[e.target.value], true);
  }

  playMusic = function () {
    this.setState({
      playing: !this.state.playing
    })
    this.playAudio(audioClips[this.state.music], !this.state.playing);
  }

  handleRandom = function () {
    this.setState({
      result: ""
    });
    setTimeout(() => {
      this.setState({
        result: randomInList(items, this.state.duplicate)
      });
    }, 4000);

    console.log(items);
  };

  onChange = function (e) {
    if (e.target.id === 'min') {
      this.setState({
        min: e.target.value
      });
      eMin = e.target.value;
    } else if (e.target.id === "max") {
      this.setState({
        max: e.target.value
      });
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
      console.log(items);
    });

  }
  render() {
    return (
      <div className="App">
        <div className="container">
          <div>
            <select name="music" defaultValue={this.state.music} onChange={this.onChangeMusic}>
              <option value={0}>original</option>
              <option value={1}>remix</option>
            </select>
            <button onClick={this.playMusic}>
              <i className={this.state.playing ? 'fas fa-play' : 'fas fa-pause'} />
            </button>
          </div>
          <div className="input-file">
            <input type="file" onChange={this.handleInputFile} />
          </div>
          <div className="option">
            <div>
              <p>
                Min
          </p>
              <input id="min" type="number" value={this.state.min} onChange={this.onChange} />
            </div>
            <div>
              <p>
                Max
          </p>
              <input id="max" type="number" value={this.state.max} onChange={this.onChange} />
            </div>
          </div>
          <div className="check-duplicate">
            <input type="checkbox" defaultChecked={this.state.duplicate}
              onChange={() => this.setState({
                duplicate: !this.state.duplicate
              })
              } />
            <label>Duplicate</label>
          </div>
          <div className="result">
            <p>
              Random number: <span>{this.state.result}</span>
            </p>
          </div>
          <div className="button">
            <button onClick={this.handleRandom} >
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
