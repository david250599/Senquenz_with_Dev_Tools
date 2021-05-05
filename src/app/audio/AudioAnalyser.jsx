import React from 'react';

export class AudioAnalyser extends React.Component{

    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);

        this.state = {
            waveAudioData: new Uint8Array(0),
            barAudioData: new Uint8Array(0)
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

        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {
        return '';
    }

}