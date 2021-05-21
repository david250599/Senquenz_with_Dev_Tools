import React from 'react';

export class AudioAnalyser extends React.Component{

    constructor(props) {
        super(props);

        this.tick         = this.tick.bind(this);
        this.maxValues    = [0];
        this.updateGain   = window.setTimeout(() => this.checkGain(), this.props.configData.updateDuration );

        this.state      = {
            waveAudioData:  new Uint8Array(0),
            barAudioData:   new Uint8Array(0),
        };

    }


    componentDidMount() {
        this.audioContext   = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser       = this.audioContext.createAnalyser();
        this.source         = this.audioContext.createMediaStreamSource(this.props.audio);
        this.gain           = this.audioContext.createGain();

        this.source.connect(this.gain);
        this.gain.connect(this.analyser);


        this.rafId = requestAnimationFrame(this.tick);
    }

    tick(){
        this.gain.gain.setValueAtTime(this.props.micSensitivity, this.audioContext.currentTime);

        //waveform data
        this.analyser.fftSize = this.props.configData.waveFFT;
        this.waveDataArray    = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(this.waveDataArray);
        this.setState({waveAudioData: this.waveDataArray});
        this.props.sendAudioData(this.waveDataArray, true);

        //frequency data
        this.analyser.fftSize = this.props.configData.barFFT;
        this.barDataArray     = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(this.barDataArray);
        this.setState({barAudioData: this.barDataArray});
        this.props.sendAudioData(this.barDataArray, false);

        this.maxValues.push(this.barDataArray[2]);

        this.rafId = requestAnimationFrame(this.tick);
    }

    checkGain(){
        window.clearTimeout(this.updateGain);

        if(this.props.autoSensitivity){
            let max = Math.max(...this.maxValues);
            if(max > this.props.configData.frequencyTopLimit){
                this.props.adjustSensitivity(this.props.configData.adjustStep * -1);
            }else if(max < this.props.configData.frequencyLowLimit){
                this.props.adjustSensitivity(this.props.configData.adjustStep);
            }
        }
        this.maxValues = [0];
        this.updateGain   = window.setTimeout(() => this.checkGain(), this.props.configData.updateDuration );
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