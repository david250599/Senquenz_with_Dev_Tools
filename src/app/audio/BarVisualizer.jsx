// Draws a bar for each value of the frequency array
// Helps to get a better feeling for the values
// Example from Mozilla - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
import React from 'react';

export class BarVisualizer extends React.Component{

    constructor(props) {
        super(props);

        this.canvas = React.createRef();

        this.state = {
            lowPassAvg:     0,
            highPassAvg:    0,
            overallAvg:     0,
            lowMax:         0,
            highMax:        0
        }
    }

    draw(){
        const audioData     = this.props.audioData;
        const canvas        = this.canvas.current;
        const height        = canvas.height;
        const width         = canvas.width;
        const context       = canvas.getContext('2d');
        const barWidth      = (width / audioData.length);
        let barHeight;
        let x               = 0;


        context.clearRect(0,0, width, height);
        context.fillStyle = 'rgb(0, 0, 0)';
        context.fillRect(0 ,0, width, height);

        for (const item of audioData) {
            barHeight = item;

            context.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            context.fillRect(x, height-barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <div className={this.props.className}>
                <canvas
                    height="256"
                    width="800"
                    ref={this.canvas}
                />
                </div>
    }

}