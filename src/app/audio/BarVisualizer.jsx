import React from 'react';

export class BarVisualizer extends React.Component{

    constructor(props) {
        super(props);

        this.canvas = React.createRef();
        this.lowPassArray = [0, 0];
        this.highPassArray = [0, 0];

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
        /*
        if (audioData.length > 0){
            const intervalLength   = Math.floor(audioData.length/2);
            this.lowPassArray      = audioData.slice(0, intervalLength);
            this.highPassArray     = audioData.slice(intervalLength+1, audioData.length-1);

            this.lowPassAvg        = this.lowPassArray.reduce(function(a, b){ return a +b})/this.lowPassArray.length
            this.highPassAvg       = this.highPassArray.reduce(function(a, b){ return a +b})/this.highPassArray.length
            this.overallAvg        = audioData.reduce(function(a, b){ return a +b})/audioData.length

            this.lowMax            = this.lowPassArray.reduce(function(a, b){ return Math.max(a , b);});
            this.highMax           = this.highPassArray.reduce(function(a, b){ return Math.max(a , b);});
        }

        if (this.lowPassAvg > this.state.lowPassAvg){
            this.setState({
                lowPassAvg: this.lowPassAvg
            })
        }
        if (this.highPassAvg > this.state.highPassAvg){
            this.setState({
                highPassAvg: this.highPassAvg
            })
        }
        if (this.overallAvg > this.state.overallAvg){
            this.setState({
                overallAvg: this.overallAvg
            })
        }

        if (this.lowMax > this.state.lowMax){
            this.setState({
                lowMax: this.lowMax
            })
        }

        if (this.highMax > this.state.highMax){
            this.setState({
                highMax: this.highMax
            })
        }
        */



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
                {/*}
                <p>{'low: ' + this.state.lowPassAvg + ', max: ' + this.state.lowMax}</p>
                <p>{'high: ' + this.state.highPassAvg + ', max: ' + this.state.highMax}</p>
                <p>{'all: ' + this.state.overallAvg}</p>
                {*/}

                </div>

    }

}