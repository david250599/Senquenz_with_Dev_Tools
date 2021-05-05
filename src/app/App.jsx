import React                from 'react';
import                           '../css/style.css';


//React Components
import {TopBar}             from './interface/TopBar';
import {BottomBar}          from './interface/BottomBar';
import {Settings}           from './interface/Settings';
import {AudioAnalyser}      from './audio/AudioAnalyser';
import {Background}         from './interface/Background';
import {DevelopInfo}        from './interface/DevelopInfo';
import {BarVisualizer}      from './audio/BarVisualizer';

// config
import config               from '../config/config.json';

// link the configuration data
const config_duration_fadeOut   = config.interface.durationFadeOut;
const config_audio_data         = config.audioAnalyser;
const config_settings           = config.settings;


export class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.fadeOutInterface = window.setTimeout(() => this.hideInterface(), config_duration_fadeOut);

        this.state = {
            visibleSettings:    false,
            visibleInterface:   true,

            //Audio parameter
            audio:              null,
            waveAudioData:      new Uint8Array(0),
            barAudioData:       new Uint8Array(0),
            micSensitivity:     1,

            //Visuals parameter
            intensity:          0.0,
            brightness:         0.0,
            hilly:              0.0,
            water:              0.0,
            urban:              0.0,
            structureSize:      0.0

        };
    }

    // Update state after Input
    handleInputEvent(event){
            this.setState({
                [event.target.name]: event.target.value
            });
    }

    // open & close the settings sidebar
    openSettings(){
        this.setState({ visibleSettings: true })
    }
    closeSettings(){
        this.setState({ visibleSettings: false })
    }

    // Hide the interface when mouse does not move for a certain amount of time
    handleMouseEvent(event){
        this.showInterface();
        window.clearTimeout(this.fadeOutInterface);
        this.fadeOutInterface = window.setTimeout(() => this.hideInterface(), config_duration_fadeOut);
    }

    // Show and hide the interface components
    hideInterface(){
        if(!this.state.visibleSettings){
            this.setState({ visibleInterface: false });
        }
    }
    showInterface(){
        this.setState({ visibleInterface: true });
    }

    // Get audio input and handle microphone button
    async getMicrophone(){
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        this.setState({ audio });
    }
    stopMicrophone(){
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({ audio: null});
    }
    toggleMicrophone(){
        if (this.state.audio){
            this.stopMicrophone();
        } else {
            this.getMicrophone();
        }
    }

    // Global Audio
    setAudioData(audioData, wave){
        if(wave){
            this.setState({
                waveAudioData: audioData
            });
        }else{
            this.setState({
                barAudioData: audioData
            });
        }
    }


  render(){
    return (
        <div className="rootContainer" onMouseMove={(event) => this.handleMouseEvent(event)}>
            <div className="interface" id={this.state.visibleInterface ? null : 'fadeOut'}>

                <TopBar
                    openSettings    = {() => this.openSettings()}
                />

                <Settings
                    closeSettings   = {() => this.closeSettings()}
                    visible         = {this.state.visibleSettings}
                    audio           = {this.state.audio}
                    micSensitivity  = {this.state.micSensitivity}
                    eventHandler    = {(event) => this.handleInputEvent(event)}
                    toggleMic       = {() => this.toggleMicrophone()}
                />
                <BottomBar
                    audioData       = {this.state.waveAudioData}
                    audio           = {this.state.audio}
                />


            </div>
            <DevelopInfo
                eventHandler    = {(event) => this.handleInputEvent(event)}
                intensity       = {this.state.intensity}
                brightness      = {this.state.brightness}
                hilly           = {this.state.hilly}
                water           = {this.state.water}
                urban           = {this.state.urban}
                structureSize   = {this.state.structureSize}
            />


            {this.state.audio ? <div>
                                <AudioAnalyser
                                    audio           = {this.state.audio}
                                    sendAudioData   = {(data, wave) => this.setAudioData(data, wave)}
                                    micSensitivity  = {this.state.micSensitivity}
                                    configData      = {config_audio_data}
                                />
                                <BarVisualizer
                                    className       = "barVisualiser"
                                    audioData       = {this.state.barAudioData}
                                />
                                </div>

                                : ''}
            <Background/>


        </div>

    );
  }


}


