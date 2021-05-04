import React from 'react';


export class WaveformVisualizer extends React.Component{

    constructor(props) {
        super(props);

        this.canvas         = React.createRef();
    }

    draw() {
        const audioData     = this.props.audioData;
        const canvas        = this.canvas.current;
        const height        = canvas.height;
        const width         = canvas.width;
        const context       = canvas.getContext('2d');
        let x               = 0;
        const sliceWidth    = (width * 1.0) / audioData.length;

        context.lineWidth   = 1;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.moveTo(0, height / 2);

        for (const item of audioData) {
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
        }

        context.lineTo(x, height / 2);
        context.stroke();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <canvas height={this.props.height} width={this.props.width} ref={this.canvas}/>
    }

}