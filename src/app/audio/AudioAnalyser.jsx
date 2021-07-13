// Analyses the audio mediastream with a FFT (Web Audio API, Analyser Node)
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
// Inspired by Phil Nash - https://www.twilio.com/blog/audio-visualisation-web-audio-api--react
import React from 'react';

export class AudioAnalyser extends React.Component{

    constructor(props) {
        super(props);
        this.tick               = this.tick.bind(this);
        this.maxValuesGain      = [0];
        this.beat               = 1;
        this.oldAvg             = 0;

        // config data
        this.waveFFT            = this.props.configData.waveFFT;
        this.barFFT             = this.props.configData.barFFT;

        this.minDifference      = this.props.configData.minDifference;
        this.reduceStep         = this.props.configData.reduceStep;

        this.updateDuration     = this.props.configData.updateDuration;
        this.frequencyTopLimit  = this.props.configData.frequencyTopLimit;
        this.frequencyLowLimit  = this.props.configData.frequencyLowLimit
        this.adjustStep         = this.props.configData.adjustStep

        this.updateGain         = window.setTimeout(() => this.checkGain(), this.updateDuration );
        this.state = {
            waveAudioData:  new Uint8Array(0),
            barAudioData:   new Uint8Array(0),
        };
    }

    // Setup the audio routing graph
    componentDidMount() {
        this.audioContext   = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser       = this.audioContext.createAnalyser();
        this.source         = this.audioContext.createMediaStreamSource(this.props.audio);
        this.gain           = this.audioContext.createGain();

        this.source.connect(this.gain);
        this.gain.connect(this.analyser);

        this.rafId = requestAnimationFrame(this.tick);
    }

    // Gets called up to 60 times a second
    tick(){
        // Set gain for sensitivity adjustment
        this.gain.gain.setValueAtTime(this.props.micSensitivity, this.audioContext.currentTime);

        // waveform data
        // Is needed for the audio graph in bottombar
        this.analyser.fftSize = this.waveFFT;
        this.waveDataArray    = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(this.waveDataArray);
        this.setState({waveAudioData: this.waveDataArray});

        // frequency data
        // Is needed for the audio parameters which come in need for the visuals animation
        this.analyser.fftSize = this.barFFT;
        this.barDataArray     = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(this.barDataArray);
        this.setState({barAudioData: this.barDataArray});

        // Map lower frequency to beat parameter
        // The first 3 of the Array are observed
        // If one of the is Null - no calculations
        for(let i = 0; i < 3; i++){
            if(this.barDataArray[i] === null){
                this.arrayisNull = true;
            }
        }

        // Compare the new average to the old
        // If the different is higher that 60, set beat to avg
        // In the following runs, the beat values will be lowered until the next higher avg
        if(!this.arrayisNull){
            let newAvg       = (this.barDataArray[0] + this.barDataArray[1] + this.barDataArray[2])/3;
            this.arrayisNull = false;

            if(newAvg - this.oldAvg > this.minDifference){
                this.beat = newAvg;

            }else if(this.beat > this.reduceStep) {
                this.beat -= this.reduceStep;
            }

            this.oldAvg = newAvg;
        }

        // overall AVG
        // Tells if the sounds is loud or quiet
        let overallAvg = this.barDataArray.reduce(function (a,b){
                                                    return a + b
                                                 })/this.barDataArray.length;

        // Send audio values to main component
        this.props.sendAudioData(this.waveDataArray, this.barDataArray, this.beat, overallAvg);

        // Automatic adjustment
        this.maxValuesGain.push(this.barDataArray[2]);

        this.rafId = requestAnimationFrame(this.tick);
    }

    checkGain(){
        window.clearTimeout(this.updateGain);

        // Get the max value of all collected frequencies and check if its higher 240 or lower 170
        // Sensitivity gets adjusted if needed
        if(this.props.autoSensitivity){
            let max = Math.max(...this.maxValuesGain);

            if(max > this.frequencyTopLimit){
                this.props.adjustSensitivity(this.adjustStep * -1);

            }else if(max < this.frequencyLowLimit){
                this.props.adjustSensitivity(this.adjustStep);
            }
        }

        this.maxValuesGain = [0];
        // Call again in 4sec
        this.updateGain    = window.setTimeout(() => this.checkGain(), this.updateDuration );
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.gain.disconnect();
        this.analyser.disconnect();
        this.source.disconnect();
        window.clearTimeout(this.updateGain);
    }

    render() {
        return '';
    }


}