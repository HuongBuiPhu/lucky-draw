import React, { Component } from 'react'
import './Header.css';
import Switch from 'react-switch';
import { Howl } from 'howler';
import xoso1 from '../resources/xo-so-original.mp3';
import xoso2 from '../resources/xo-so-remix-dan-tranh.mp3';
import xoso3 from '../resources/xo-so-remix-2.mp3';
import bond from '../resources/bond_victory.mp3';
import blackjack from '../resources/blackjack_remix.mp3';

const audioClips = [
    { sound: xoso1, label: 'Melodia dla Zuzi original', index: 0 },
    { sound: xoso2, label: 'Melodia dla Zuzi remix 1', index: 1 },
    { sound: xoso3, label: 'Melodia dla Zuzi remix 2', index: 2 },
    { sound: bond, label: 'Bond - Victory', index: 3 },
    { sound: blackjack, label: 'Blackjack ft. Melodia dla Zuzi', index: 4 }
];

let currSound = 0;

class Header extends Component {

    static dup = true;
    static eff = true;

    constructor(props) {
        super(props);

        this.state = {
            min: 0,
            max: 0,
            numPrize: 1,
            music: currSound,
            playing: false,
            openMenu: true,
            inputFile: false,
            duplicate: Header.dup,
            soundEffect: Header.eff,
        };

        this.playAudio = this.playAudio.bind(this);
        this.onChangeMusic = this.onChangeMusic.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.onClickMenu = this.onClickMenu.bind(this);
        this.onSwitchInput = this.onSwitchInput.bind(this);
        this.onSwitchRandom = this.onSwitchRandom.bind(this);
        this.onSwitchEffect = this.onSwitchEffect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleInputFile = this.handleInputFile.bind(this);
        this.onChangeNumPrize = this.onChangeNumPrize.bind(this);
    }

    onChange = function (e) {
        if (e.target.id === 'min') {
            this.setState({
                min: e.target.value
            });
        } else if (e.target.id === "max") {
            this.setState({
                max: e.target.value
            });
        }

        this.props.onChangeNumberValue(e.target.id, e.target.value);
    }

    onChangeNumPrize = function (e) {
        this.setState({
            numPrize: e.target.value
        });

        this.props.onChangePrize(e.target.value);
    }

    handleInputFile = function (e) {
        this.props.onInputFile(e);
    }

    onClickMenu = function () {
        this.setState({
            openMenu: !this.state.openMenu
        });
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
            volume: 0.5,
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

    onSwitchInput = function (e) {
        this.setState({
            inputFile: e
        })
    }

    onSwitchRandom = function (e) {
        this.setState({
            duplicate: e
        })

        Header.dup = e;
    }

    onSwitchEffect = function (e) {
        this.setState({
            soundEffect: e
        })

        Header.eff = e;
    }

    render() {
        return (
            <div className="header" >
                <h1 className="title">
                    <i className="fas fa-gift" />
                    Lucky Draw
                </h1>
                <div className='p-right'>
                    <div className="music-container">
                        <div className="music-icon">
                            <i className="fas fa-music" />
                        </div>
                        <select className="audio-selector" defaultValue={this.state.music} onChange={this.onChangeMusic}>
                            <option value={0}>{audioClips[0].label}</option>
                            <option value={1}>{audioClips[1].label}</option>
                            <option value={2}>{audioClips[2].label}</option>
                            <option value={3}>{audioClips[3].label}</option>
                            <option value={4}>{audioClips[4].label}</option>
                        </select>
                        <div className="play-icon" onClick={this.playMusic}>
                            <i className={this.state.playing ? 'fas fa-pause' : 'fas fa-play'} />
                        </div>
                    </div>
                    <div className="menu-icon" onClick={this.onClickMenu}>
                        <i className={this.state.openMenu ? "far fa-caret-square-up fa-2x" : "far fa-caret-square-down fa-2x"} />
                    </div>
                </div>
                <div className={this.state.openMenu ? "option-menu active" : "option-menu"}>
                    <div className="option">
                        <div className="type">
                            <label>Duplicate</label>
                            <Switch id="random-switch"
                                className="switch"
                                checked={this.state.duplicate}
                                onChange={this.onSwitchRandom}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={15}
                                width={30}
                                onColor="#d3ec60"
                                onHandleColor="#bee21c"
                                handleDiameter={20}
                            />
                        </div>
                        <div className="type">
                            <label>Effect</label>
                            <Switch id="effect-switch"
                                className="switch"
                                checked={this.state.soundEffect}
                                onChange={this.onSwitchEffect}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={15}
                                width={30}
                                onColor="#d3ec60"
                                onHandleColor="#bee21c"
                                handleDiameter={20}
                            />
                        </div>
                        <div className="num-prize">
                            <label>Prize number</label>
                            <input className="step-input" step={1} type="range" max={30} min={1} value={this.state.numPrize} onChange={this.onChangeNumPrize} />
                            <label>{this.state.numPrize}</label>
                        </div>
                    </div>
                    <div className="input-data">
                        <div className="type">
                            <label>Import file</label>
                            <Switch id="input-switch"
                                className="switch"
                                onChange={this.onSwitchInput}
                                checked={this.state.inputFile}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={15}
                                width={30}
                                onColor="#d3ec60"
                                onHandleColor="#bee21c"
                                handleDiameter={20}
                            />
                        </div>
                        <div className="input">
                            {!this.state.inputFile ?
                                <div className="num-input">
                                    <div className="number">
                                        <p>Min</p>
                                        <input id="min" type="number" value={this.state.min} onChange={this.onChange} />
                                    </div>
                                    <div className="number">
                                        <p>Max</p>
                                        <input id="max" type="number" value={this.state.max} onChange={this.onChange} />
                                    </div>
                                </div> :
                                <div className="file-input">
                                    <input type="file" onChange={this.handleInputFile} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header