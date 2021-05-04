import React from 'react';

export class AudioAnalyser extends React.Component{

    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);

        this.state = {
            audioData: new Uint8Array(0)
        };

    }


    componentDidMount() {
        this.audioContext   = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser       = this.audioContext.createAnalyser();
        this.dataArray      = new Uint8Array(this.analyser.frequencyBinCount);
        this.source         = this.audioContext.createMediaStreamSource(this.props.audio);
        this.gain           = this.audioContext.createGain();

        this.source.connect(this.gain);
        this.gain.connect(this.analyser);

        this.rafId = requestAnimationFrame(this.tick);
    }

    tick(){
        this.gain.gain.setValueAtTime(this.props.micSensitivity, this.audioContext.currentTime);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({audioData: this.dataArray});
        this.props.sendAudioData(this.dataArray);
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